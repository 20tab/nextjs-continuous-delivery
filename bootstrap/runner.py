"""Run the bootstrap."""

import json
import os
import subprocess
from dataclasses import dataclass, field
from functools import partial
from operator import itemgetter
from pathlib import Path
from time import time

import click
from cookiecutter.main import cookiecutter
from pydantic import validate_arguments

from bootstrap.constants import (
    DEV_ENV_NAME,
    DEV_ENV_SLUG,
    DEV_ENV_STACK_CHOICES,
    DEV_STACK_SLUG,
    MAIN_STACK_SLUG,
    PROD_ENV_NAME,
    PROD_ENV_SLUG,
    PROD_ENV_STACK_CHOICES,
    STACKS_CHOICES,
    STAGE_ENV_NAME,
    STAGE_ENV_SLUG,
    STAGE_ENV_STACK_CHOICES,
    STAGE_STACK_SLUG,
    TERRAFORM_BACKEND_TFC,
)
from bootstrap.exceptions import BootstrapError
from bootstrap.helpers import format_gitlab_variable, format_tfvar

error = partial(click.style, fg="red")

highlight = partial(click.style, fg="cyan")

info = partial(click.style, dim=True)

warning = partial(click.style, fg="yellow")


@validate_arguments
@dataclass(kw_only=True)
class Runner:
    """The bootstrap runner."""

    output_dir: Path
    project_name: str
    project_slug: str
    project_dirname: str
    service_dir: Path
    service_slug: str
    internal_backend_url: str | None
    internal_service_port: int
    deployment_type: str
    environments_distribution: str
    project_url_dev: str = ""
    project_url_stage: str = ""
    project_url_prod: str = ""
    terraform_backend: str
    terraform_cloud_hostname: str | None = None
    terraform_cloud_token: str | None = None
    terraform_cloud_organization: str | None = None
    terraform_cloud_organization_create: bool | None = None
    terraform_cloud_admin_email: str | None = None
    vault_token: str | None = None
    vault_url: str | None = None
    sentry_dsn: str | None = None
    sentry_org: str | None = None
    sentry_url: str | None = None
    use_redis: bool = False
    gitlab_url: str | None = None
    gitlab_namespace_path: str | None = None
    gitlab_token: str | None = None
    uid: int | None = None
    gid: int | None = None
    terraform_dir: Path | None = None
    logs_dir: Path | None = None
    run_id: str = field(init=False)
    stacks: list = field(init=False, default_factory=list)
    envs: list = field(init=False, default_factory=list)
    gitlab_variables: dict = field(init=False, default_factory=dict)
    tfvars: dict = field(init=False, default_factory=dict)
    vault_secrets: dict = field(init=False, default_factory=dict)
    terraform_run_modules: list = field(init=False, default_factory=list)
    terraform_outputs: dict = field(init=False, default_factory=dict)

    def __post_init__(self):
        """Finalize initialization."""
        self.run_id = f"{time():.0f}"
        self.terraform_dir = self.terraform_dir or Path(f".terraform/{self.run_id}")
        self.logs_dir = self.logs_dir or Path(f".logs/{self.run_id}")
        self.set_stacks()
        self.set_envs()
        self.collect_tfvars()
        self.collect_gitlab_variables()

    def set_stacks(self):
        """Set the stacks."""
        self.stacks = STACKS_CHOICES[self.environments_distribution]

    def set_envs(self):
        """Set the envs."""
        self.envs = [
            {
                "basic_auth_enabled": True,
                "name": DEV_ENV_NAME,
                "slug": DEV_ENV_SLUG,
                "stack_slug": DEV_ENV_STACK_CHOICES.get(
                    self.environments_distribution, DEV_STACK_SLUG
                ),
                "url": self.project_url_dev,
            },
            {
                "basic_auth_enabled": True,
                "name": STAGE_ENV_NAME,
                "slug": STAGE_ENV_SLUG,
                "stack_slug": STAGE_ENV_STACK_CHOICES.get(
                    self.environments_distribution, STAGE_STACK_SLUG
                ),
                "url": self.project_url_stage,
            },
            {
                "basic_auth_enabled": False,
                "name": PROD_ENV_NAME,
                "slug": PROD_ENV_SLUG,
                "stack_slug": PROD_ENV_STACK_CHOICES.get(
                    self.environments_distribution, MAIN_STACK_SLUG
                ),
                "url": self.project_url_prod,
            },
        ]

    def register_gitlab_variable(
        self, level, var_name, var_value=None, masked=False, protected=True
    ):
        """Register a GitLab variable at the given level."""
        vars_dict = self.gitlab_variables.setdefault(level, {})
        if var_value is None:
            var_value = getattr(self, var_name)
        vars_dict[var_name] = format_gitlab_variable(var_value, masked, protected)

    def register_gitlab_variables(self, level, *vars):
        """Register one or more GitLab variable at  the given level."""
        [
            self.register_gitlab_variable(level, *((i,) if isinstance(i, str) else i))
            for i in vars
        ]

    def register_gitlab_group_variables(self, *vars):
        """Register one or more GitLab group variable."""
        self.register_gitlab_variables("group", *vars)

    def register_gitlab_project_variables(self, *vars):
        """Register one or more GitLab project variable."""
        self.register_gitlab_variables("project", *vars)

    def collect_gitlab_variables(self):
        """Collect the GitLab group and project variables."""
        if self.sentry_dsn:
            self.register_gitlab_project_variables(
                ("SENTRY_ORG", self.sentry_org),
                ("SENTRY_URL", self.sentry_url),
                ("SENTRY_ENABLED", "true"),
            )
        if not self.vault_url:
            self.collect_gitlab_variables_secrets()

    def collect_gitlab_variables_secrets(self):
        """Collect secrets as GitLab group and project variables."""
        if self.sentry_dsn:
            self.register_gitlab_project_variables(
                ("SENTRY_DSN", self.sentry_dsn, True)
            )

    def render_gitlab_variables_to_string(self, level):
        """Return the given level GitLab variables rendered to string."""
        return "{%s}" % ", ".join(
            f"{k} = {v}" for k, v in self.gitlab_variables.get(level, {}).items()
        )

    def register_tfvar(self, tf_stage, var_name, var_value=None, var_type=None):
        """Register a Terraform variable value to the given stage."""
        vars_list = self.tfvars.setdefault(tf_stage, [])
        if var_value is None:
            var_value = getattr(self, var_name)
        vars_list.append("=".join((var_name, format_tfvar(var_value, var_type))))

    def register_tfvars(self, tf_stage, *vars):
        """Register one or more Terraform variables to the given stage."""
        [
            self.register_tfvar(tf_stage, *((i,) if isinstance(i, str) else i))
            for i in vars
        ]

    def register_environment_tfvars(self, *vars, env_slug=None):
        """Register one or more environment Terraform variables."""
        tf_stage = "environment" + (env_slug and f"_{env_slug}" or "")
        self.register_tfvars(tf_stage, *vars)

    def collect_tfvars(self):
        """Collect Terraform variables."""
        self.register_environment_tfvars(
            ("internal_backend_url", self.internal_backend_url),
            ("service_slug", self.service_slug),
        )
        for env in self.envs:
            self.register_environment_tfvars(
                ("environment", env["name"]),
                ("project_url", env["url"]),
                ("stack_slug", env["stack_slug"]),
                env_slug=env["slug"],
            )

    def register_vault_environment_secret(self, env_name, secret_name, secret_data):
        """Register a Vault environment secret locally."""
        self.vault_secrets[f"envs/{env_name}/{secret_name}"] = secret_data

    def collect_vault_environment_secrets(self, env_name):
        """Collect the Vault secrets for the given environment."""
        # Sentry env vars are used by the GitLab CI/CD
        self.sentry_dsn and self.register_vault_environment_secret(
            env_name, f"{self.service_slug}/sentry", {"sentry_dsn": self.sentry_dsn}
        )

    def collect_vault_secrets(self):
        """Collect Vault secrets."""
        [self.collect_vault_environment_secrets(env["name"]) for env in self.envs]

    def init_service(self):
        """Initialize the service."""
        click.echo(info("...cookiecutting the service"))
        cookiecutter(
            os.path.dirname(os.path.dirname(__file__)),
            extra_context={
                "deployment_type": self.deployment_type,
                "internal_service_port": self.internal_service_port,
                "project_dirname": self.project_dirname,
                "project_name": self.project_name,
                "project_slug": self.project_slug,
                "resources": {"envs": self.envs, "stacks": self.stacks},
                "service_slug": self.service_slug,
                "terraform_backend": self.terraform_backend,
                "terraform_cloud_organization": self.terraform_cloud_organization,
                "tfvars": self.tfvars,
                "use_redis": self.use_redis and "true" or "false",
                "use_vault": self.vault_url and "true" or "false",
            },
            output_dir=self.output_dir,
            no_input=True,
        )

    def create_env_file(self):
        """Create env file from the template."""
        click.echo(info("...generating the .env file"))
        env_path = self.service_dir / ".env_template"
        env_text = env_path.read_text()
        (self.service_dir / ".env").write_text(env_text)

    def init_terraform_cloud(self):
        """Initialize the Terraform Cloud resources."""
        click.echo(info("...creating the Terraform Cloud resources with Terraform"))
        env = {
            "TF_VAR_admin_email": self.terraform_cloud_admin_email,
            "TF_VAR_create_organization": self.terraform_cloud_organization_create
            and "true"
            or "false",
            "TF_VAR_environments": json.dumps(list(map(itemgetter("slug"), self.envs))),
            "TF_VAR_hostname": self.terraform_cloud_hostname,
            "TF_VAR_organization_name": self.terraform_cloud_organization,
            "TF_VAR_project_name": self.project_name,
            "TF_VAR_project_slug": self.project_slug,
            "TF_VAR_service_slug": self.service_slug,
            "TF_VAR_terraform_cloud_token": self.terraform_cloud_token,
        }
        self.run_terraform("terraform-cloud", env)

    def init_gitlab(self):
        """Initialize the GitLab repository and associated resources."""
        click.echo(info("...creating the GitLab repository and associated resources"))
        env = {
            "TF_VAR_gitlab_token": self.gitlab_token,
            "TF_VAR_gitlab_url": self.gitlab_url,
            "TF_VAR_group_variables": self.render_gitlab_variables_to_string("group"),
            "TF_VAR_namespace_path": self.gitlab_namespace_path,
            "TF_VAR_project_name": self.project_name,
            "TF_VAR_project_slug": self.project_slug,
            "TF_VAR_project_variables": self.render_gitlab_variables_to_string(
                "project"
            ),
            "TF_VAR_service_dir": self.service_dir,
            "TF_VAR_service_slug": self.service_slug,
        }
        self.run_terraform("gitlab", env)

    def init_vault(self):
        """Initialize the Vault resources."""
        click.echo(info("...creating the Vault resources with Terraform"))
        self.collect_vault_secrets()
        env = {
            "TF_VAR_project_slug": self.project_slug,
            "TF_VAR_secrets": json.dumps(self.vault_secrets),
            "TF_VAR_vault_address": self.vault_url,
            "TF_VAR_vault_token": self.vault_token,
        }
        self.run_terraform("vault", env)

    def get_terraform_module_params(self, module_name, env):
        """Return Terraform parameters for the given module."""
        return (
            Path(__file__).parent.parent / "terraform" / module_name,
            self.logs_dir / self.service_slug / "terraform" / module_name,
            terraform_dir := self.terraform_dir / self.service_slug / module_name,
            {
                **env,
                "PATH": os.environ.get("PATH"),
                "TF_DATA_DIR": str((terraform_dir / "data").resolve()),
                "TF_LOG": "INFO",
            },
        )

    def run_terraform_init(self, cwd, env, logs_dir, state_path):
        """Run Terraform init."""
        init_log_path = logs_dir / "init.log"
        init_stdout_path = logs_dir / "init-stdout.log"
        init_stderr_path = logs_dir / "init-stderr.log"
        init_process = subprocess.run(
            [
                "terraform",
                "init",
                "-backend-config",
                f"path={state_path.resolve()}",
                "-input=false",
                "-no-color",
            ],
            capture_output=True,
            cwd=cwd,
            env=dict(**env, TF_LOG_PATH=str(init_log_path.resolve())),
            text=True,
        )
        init_stdout_path.write_text(init_process.stdout)
        if init_process.returncode != 0:
            init_stderr_path.write_text(init_process.stderr)
            click.echo(
                error(
                    "Terraform init failed "
                    f"(check {init_stderr_path} and {init_log_path})"
                )
            )
            raise BootstrapError

    def run_terraform_apply(self, cwd, env, logs_dir):
        """Run Terraform apply."""
        apply_log_path = logs_dir / "apply.log"
        apply_stdout_path = logs_dir / "apply-stdout.log"
        apply_stderr_path = logs_dir / "apply-stderr.log"
        apply_process = subprocess.run(
            ["terraform", "apply", "-auto-approve", "-input=false", "-no-color"],
            capture_output=True,
            cwd=cwd,
            env=dict(**env, TF_LOG_PATH=str(apply_log_path.resolve())),
            text=True,
        )
        apply_stdout_path.write_text(apply_process.stdout)
        if apply_process.returncode != 0:
            apply_stderr_path.write_text(apply_process.stderr)
            click.echo(
                error(
                    "Terraform apply failed "
                    f"(check {apply_stderr_path} and {apply_log_path})"
                )
            )
            self.reset_terraform()
            raise BootstrapError

    def run_terraform_destroy(self, cwd, env, logs_dir):
        """Run Terraform destroy."""
        destroy_log_path = logs_dir / "destroy.log"
        destroy_stdout_path = logs_dir / "destroy-stdout.log"
        destroy_stderr_path = logs_dir / "destroy-stderr.log"
        destroy_process = subprocess.run(
            [
                "terraform",
                "destroy",
                "-auto-approve",
                "-input=false",
                "-no-color",
            ],
            capture_output=True,
            cwd=cwd,
            env=dict(**env, TF_LOG_PATH=str(destroy_log_path.resolve())),
            text=True,
        )
        destroy_stdout_path.write_text(destroy_process.stdout)
        if destroy_process.returncode != 0:
            destroy_stderr_path.write_text(destroy_process.stderr)
            click.echo(
                error(
                    "Terraform destroy failed "
                    f"(check {destroy_stderr_path} and {destroy_log_path})"
                )
            )
            raise BootstrapError

    def get_terraform_outputs(self, cwd, env, outputs):
        """Get Terraform outputs."""
        return {
            output_name: subprocess.run(
                ["terraform", "output", "-raw", output_name],
                capture_output=True,
                cwd=cwd,
                env=env,
                text=True,
            ).stdout
            for output_name in outputs
        }

    def reset_terraform(self):
        """Destroy all Terraform modules resources."""
        for module_name, env in self.terraform_run_modules:
            click.echo(warning(f"Destroying Terraform {module_name} resources."))
            cwd, logs_dir, _terraform_dir, env = self.get_terraform_module_params(
                module_name, env
            )
            self.run_terraform_destroy(cwd, env, logs_dir)

    def run_terraform(self, module_name, env, outputs=None):
        """Initialize the Terraform controlled resources."""
        self.terraform_run_modules.append((module_name, env))
        cwd, logs_dir, terraform_dir, env = self.get_terraform_module_params(
            module_name, env
        )
        os.makedirs(terraform_dir, exist_ok=True)
        os.makedirs(logs_dir)
        self.run_terraform_init(cwd, env, logs_dir, terraform_dir / "terraform.tfstate")
        self.run_terraform_apply(cwd, env, logs_dir)
        outputs and self.terraform_outputs.update(
            {module_name: self.get_terraform_outputs(cwd, env, outputs)}
        )

    def make_sed(self, file_path, placeholder, replace_value):
        """Replace a placeholder value with a given one in a given file."""
        subprocess.run(
            [
                "sed",
                "-i",
                f"s/{placeholder}/{replace_value}/",
                str(self.output_dir / self.project_dirname / file_path),
            ]
        )

    def change_output_owner(self):
        """Change the owner of the output directory recursively."""
        if self.uid:
            subprocess.run(
                [
                    "chown",
                    "-R",
                    ":".join(map(str, filter(None, (self.uid, self.gid)))),
                    self.service_dir,
                ]
            )

    def run(self):
        """Run the bootstrap."""
        click.echo(highlight(f"Initializing the {self.service_slug} service:"))
        self.init_service()
        self.create_env_file()
        if self.terraform_backend == TERRAFORM_BACKEND_TFC:
            self.init_terraform_cloud()
        if self.gitlab_namespace_path:
            self.init_gitlab()
        if self.vault_url:
            self.init_vault()
        self.change_output_owner()
