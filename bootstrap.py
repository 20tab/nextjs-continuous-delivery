#!/usr/bin/env python
"""Initialize a web project Next.js service based on a template."""

import os
import shutil
import subprocess
from functools import partial
from pathlib import Path

import click
import validators
from cookiecutter.main import cookiecutter
from slugify import slugify

DEPLOY_TYPE_CHOICES = ["k8s-digitalocean", "k8s-other"]
DEPLOY_TYPE_DEFAULT = "k8s-digitalocean"
GITLAB_TOKEN_ENV_VAR = "GITLAB_PRIVATE_TOKEN"
OUTPUT_DIR = os.getenv("OUTPUT_DIR")

error = partial(click.style, fg="red")
highlight = partial(click.style, fg="cyan")
info = partial(click.style, dim=True)
warning = partial(click.style, fg="yellow")


def init_service(
    output_dir,
    project_name,
    project_slug,
    project_dirname,
    service_slug,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    deploy_type,
):
    """Initialize the service."""
    click.echo(info("...cookiecutting the service"))
    cookiecutter(
        ".",
        extra_context={
            "deploy_type": deploy_type,
            "project_dirname": project_dirname,
            "project_name": project_name,
            "project_slug": project_slug,
            "project_url_dev": project_url_dev,
            "project_url_prod": project_url_prod,
            "project_url_stage": project_url_stage,
            "service_slug": service_slug,
        },
        output_dir=output_dir,
        no_input=True,
    )


def create_env_file(service_dir):
    """Create env file from the template."""
    click.echo(info("...generating the .env file"))
    env_path = Path(service_dir) / ".env_template"
    env_text = env_path.read_text()
    (Path(service_dir) / ".env").write_text(env_text)


def init_gitlab(
    gitlab_group_slug,
    gitlab_private_token,
    gitlab_project_variables,
    gitlab_group_variables,
    project_name,
    project_slug,
    service_slug,
    service_dir,
):
    """Initialize the Gitlab repository and associated resources."""
    click.echo(info("...creating the Gitlab repository and associated resources"))
    env = {
        "TF_VAR_gitlab_group_variables": "{%s}"
        % ", ".join(f"{k} = {v}" for k, v in gitlab_group_variables.items()),
        "TF_VAR_gitlab_group_slug": gitlab_group_slug,
        "TF_VAR_gitlab_token": gitlab_private_token,
        "TF_VAR_project_name": project_name,
        "TF_VAR_project_slug": project_slug,
        "TF_VAR_gitlab_project_variables": "{%s}"
        % ", ".join(f"{k} = {v}" for k, v in gitlab_project_variables.items()),
        "TF_VAR_service_dir": service_dir,
        "TF_VAR_service_slug": service_slug,
    }
    cwd = Path("terraform")
    init_process = subprocess.run(
        ["terraform", "init", "-reconfigure", "-input=false", "-no-color"],
        capture_output=True,
        cwd=cwd,
        env=env,
        text=True,
    )
    if init_process.returncode == 0:
        (cwd / ".terraform-init.log").write_text(init_process.stdout)
        apply_process = subprocess.run(
            ["terraform", "apply", "-auto-approve", "-input=false", "-no-color"],
            capture_output=True,
            cwd=cwd,
            env=env,
            text=True,
        )
        if apply_process.returncode == 0:
            (cwd / ".terraform-apply.log").write_text(apply_process.stdout)
        else:
            (cwd / ".terraform-apply-errors.log").write_text(apply_process.stderr)
            click.echo(
                error(
                    "Error applying Terraform Gitlab configuration "
                    "(see terraform/.terraform-apply-errors.log)"
                )
            )
            raise click.Abort()
    else:
        (cwd / ".terraform-init-errors.log").write_text(init_process.stderr)
        click.echo(
            error(
                "Error initializing Terraform "
                "(see terraform/.terraform-init-errors.log)"
            )
        )
        raise click.Abort()


def change_output_owner(service_dir, uid):
    """Change the owner of the output directory recursively."""
    uid is not None and subprocess.run(["chown", "-R", uid, service_dir])


def run(
    uid,
    output_dir,
    project_name,
    project_slug,
    project_dirname,
    service_slug,
    service_dir,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    deploy_type,
    digitalocean_token=None,
    sentry_dsn=None,
    use_gitlab=None,
    create_group_variables=None,
    gitlab_private_token=None,
    gitlab_group_slug=None,
):
    """Run the bootstrap."""
    deploy_type = (
        deploy_type in DEPLOY_TYPE_CHOICES
        and deploy_type
        or click.prompt(
            "Deploy type",
            default=DEPLOY_TYPE_DEFAULT,
            type=click.Choice(DEPLOY_TYPE_CHOICES, case_sensitive=False),
        )
    ).lower()
    if "digitalocean" in deploy_type:
        digitalocean_token = validate_or_prompt_password(
            digitalocean_token, "DigitalOcean token", required=True
        )
    click.echo(highlight(f"Initializing the {service_slug} service:"))
    init_service(
        output_dir,
        project_name,
        project_slug,
        project_dirname,
        service_slug,
        project_url_dev,
        project_url_stage,
        project_url_prod,
        deploy_type,
    )
    create_env_file(service_dir)
    change_output_owner(service_dir, uid)
    use_gitlab = (
        use_gitlab
        if use_gitlab is not None
        else click.confirm(warning("Do you want to configure Gitlab?"), default=True)
    )
    if use_gitlab:
        if not gitlab_group_slug:
            gitlab_group_slug = click.prompt("Gitlab group slug", default=project_slug)
            click.confirm(
                warning(
                    f'Make sure the Gitlab "{gitlab_group_slug}" group exists '
                    "before proceeding. Continue?"
                ),
                abort=True,
            )
        gitlab_private_token = validate_or_prompt_password(
            gitlab_private_token,
            "Gitlab private token (with API scope enabled)",
            required=True,
        )
        sentry_dsn = validate_or_prompt_url(
            sentry_dsn,
            "Sentry DSN (leave blank if unused)",
            default="",
        )
        gitlab_project_variables = {}
        sentry_dsn and gitlab_project_variables.update(
            SENTRY_DSN='{value = "%s"}' % sentry_dsn
        )
        gitlab_group_variables = {}
        create_group_variables = (
            create_group_variables
            if create_group_variables is not None
            else click.confirm(
                warning("Do you want to create Gitlab group variables?"),
                default=False,
            )
        )
        if create_group_variables:
            digitalocean_token and gitlab_group_variables.update(
                DIGITALOCEAN_TOKEN='{value = "%s"}' % digitalocean_token
            )
        init_gitlab(
            gitlab_group_slug,
            gitlab_private_token,
            gitlab_project_variables,
            gitlab_group_variables,
            project_name,
            project_slug,
            service_slug,
            service_dir,
        )


def slugify_option(ctx, param, value):
    """Slugify an option value."""
    return value and slugify(value)


def validate_or_prompt_url(value, message, default=None, required=False):
    """Validate the given URL or prompt until a valid value is provided."""
    if value is not None:
        if not required and value == "" or validators.url(value):
            return value
        else:
            click.echo("Please type a valid URL!")
    new_value = click.prompt(message, default=default)
    return validate_or_prompt_url(new_value, message, default, required)


def validate_or_prompt_password(value, message, default=None, required=False):
    """Validate the given password or prompt until a valid value is provided."""
    if value is not None:
        if not required and value == "" or validators.length(value, min=8):
            return value
        else:
            click.echo("Please type at least 8 chars!")
    new_value = click.prompt(message, default=default, hide_input=True)
    return validate_or_prompt_password(new_value, message, default, required)


@click.command()
@click.option("--uid", type=int)
@click.option("--output-dir", default=".", required=OUTPUT_DIR is None)
@click.option("--project-name", prompt=True)
@click.option("--project-slug", callback=slugify_option)
@click.option("--project-dirname")
@click.option("--service-slug", callback=slugify_option)
@click.option("--project-url-dev")
@click.option("--project-url-stage")
@click.option("--project-url-prod")
@click.option(
    "--deploy-type",
    type=click.Choice(DEPLOY_TYPE_CHOICES, case_sensitive=False),
)
@click.option("--digitalocean-token")
@click.option("--sentry-dsn")
@click.option("--use-gitlab/--no-gitlab", is_flag=True, default=None)
@click.option("--create-group-variables", is_flag=True, default=None)
@click.option("--gitlab-private-token", envvar=GITLAB_TOKEN_ENV_VAR)
@click.option("--gitlab-group-slug")
def init_command(
    uid,
    output_dir,
    project_name,
    project_slug,
    project_dirname,
    service_slug,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    deploy_type,
    digitalocean_token,
    sentry_dsn,
    use_gitlab,
    create_group_variables,
    gitlab_private_token,
    gitlab_group_slug,
):
    """Collect options and run the bootstrap."""
    output_dir = OUTPUT_DIR or output_dir
    project_slug = slugify(
        project_slug or click.prompt("Project slug", default=slugify(project_name)),
    )
    project_dirname_choices = [
        slugify(service_slug, separator=""),
        slugify(project_slug, separator=""),
    ]
    project_dirname = project_dirname or click.prompt(
        "Project dirname",
        default=project_dirname_choices[0],
        type=click.Choice(project_dirname_choices),
    )
    service_slug = slugify(
        service_slug or click.prompt("Service slug", default="django"),
    )
    service_dir = str(Path(output_dir) / project_dirname)
    if Path(service_dir).is_dir() and click.confirm(
        warning(
            f'A directory "{service_dir}" already exists and '
            "must be deleted. Continue?",
        ),
        abort=True,
    ):
        shutil.rmtree(service_dir)
    project_url_dev = validate_or_prompt_url(
        project_url_dev,
        "Development environment complete URL",
        default=f"https://dev.{project_slug}.com/",
    )
    project_url_stage = validate_or_prompt_url(
        project_url_stage,
        "Staging environment complete URL",
        default=f"https://stage.{project_slug}.com/",
    )
    project_url_prod = validate_or_prompt_url(
        project_url_prod,
        "Production environment complete URL",
        default=f"https://www.{project_slug}.com/",
    )
    run(
        uid,
        output_dir,
        project_name,
        project_slug,
        project_dirname,
        service_slug,
        service_dir,
        project_url_dev,
        project_url_stage,
        project_url_prod,
        deploy_type,
        digitalocean_token,
        sentry_dsn,
        use_gitlab,
        create_group_variables,
        gitlab_private_token,
        gitlab_group_slug,
    )


if __name__ == "__main__":
    init_command()
