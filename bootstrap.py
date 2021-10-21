#!/usr/bin/env python
"""Boostrap a web project based on templates."""

import os
import shutil
import subprocess
from pathlib import Path

import click
from cookiecutter.main import cookiecutter
from slugify import slugify

GITLAB_TOKEN_ENV_VAR = "GITLAB_PRIVATE_TOKEN"
OUTPUT_BASE_DIR = os.getenv("OUTPUT_BASE_DIR")


class BootstrapHandler:
    """The bootstrap procedure handler."""

    def __init__(
        self,
        output_dir,
        project_name,
        project_slug,
        project_dirname,
        service_name,
        service_slug,
        use_gitlab,
        gitlab_group_slug,
        gitlab_private_token,
    ):
        """Initialize the handler."""
        self.project_name = project_name
        self.project_slug = project_slug
        self.project_dirname = project_dirname
        self.service_name = service_name
        self.service_slug = service_slug
        self.use_gitlab = use_gitlab
        self.gitlab_group_slug = gitlab_group_slug
        self.gitlab_private_token = gitlab_private_token
        self.output_dir = OUTPUT_BASE_DIR or output_dir
        self.service_dir = (
            Path(self.output_dir) / Path(self.project_dirname)
        ).resolve()

    def create_env_file(self):
        """Create env file from the template."""
        env_path = Path(self.service_dir) / Path(".env_template")
        env_template = env_path.read_text()
        env_path.write_text(env_template)

    def init_service(self):
        """Initialize the service."""
        if Path(self.service_dir).is_dir() and click.confirm(
            f'A directory "{self.service_dir}" already exists and '
            "must be deleted. Continue?"
        ):
            shutil.rmtree(self.service_dir)
        """Initialize the frontend service project."""
        cookiecutter(
            ".",
            extra_context={
                "project_dirname": self.project_dirname,
                "project_name": self.project_name,
                "project_slug": self.project_slug,
                "service_name": self.service_name,
                "service_slug": self.service_slug,
            },
            output_dir=self.output_dir,
            no_input=True,
        )

    def init_gitlab(self):
        """Initialize the Gitlab repositories."""
        env = {
            "TF_VAR_gitlab_group_slug": self.gitlab_group_slug,
            "TF_VAR_gitlab_token": self.gitlab_private_token,
            "TF_VAR_service_dir": self.service_dir,
            "TF_VAR_project_name": self.project_name,
            "TF_VAR_project_slug": self.project_slug,
        }
        subprocess.run(
            ["terraform", "init", "-reconfigure", "-input=false"],
            cwd="terraform",
            env=env,
        )
        subprocess.run(
            [
                "terraform",
                "apply",
                "-auto-approve",
                "-input=false",
            ],
            cwd="terraform",
            env=env,
        )

    # def change_output_owner(self):
    #     """Change the owner of the output directory recursively."""
    #     self.user_id is not None and subprocess.run(
    #         f"chown -R {self.user_id} {self.output_dir}"
    #     )

    def run(self):
        """Run main process."""
        self.init_service()
        self.create_env_file()
        self.use_gitlab and self.init_gitlab()
        # self.change_output_owner()


def slugify_option(ctx, param, value):
    """Slugify an option value."""
    return value and slugify(value)


@click.command()
@click.option("--output-dir", default=".", required=OUTPUT_BASE_DIR is None)
@click.option("--project-name", prompt=True)
@click.option("--project-slug", callback=slugify_option)
@click.option("--project-dirname")
@click.option("--service-name", default="NextJS", prompt=True)
@click.option("--service-slug", callback=slugify_option)
@click.option("--use-gitlab/--no-gitlab", is_flag=True, default=None)
@click.option("--gitlab-private-token", envvar=GITLAB_TOKEN_ENV_VAR)
@click.option("--gitlab-group-slug")
def init_handler(
    output_dir,
    project_name,
    project_slug,
    project_dirname,
    service_name,
    service_slug,
    use_gitlab,
    gitlab_private_token,
    gitlab_group_slug,
):
    """Init the bootstrap handler."""
    project_slug = slugify(
        project_slug or click.prompt("Project slug", default=slugify(project_name)),
    )
    service_slug = slugify(
        service_slug or click.prompt("Service slug", default=slugify(service_name)),
    )
    project_dirname = project_dirname or click.prompt(
        "Service dirname",
        default=service_slug,
        type=click.Choice([service_slug, project_slug]),
    )
    use_gitlab = (
        use_gitlab
        if use_gitlab is not None
        else click.confirm("Do you want to configure Gitlab?", default=True)
    )
    if use_gitlab:
        gitlab_group_slug = gitlab_group_slug or click.prompt(
            "Gitlab group slug", default=project_slug
        )
        click.confirm(
            f'Make sure the Gitlab "{gitlab_group_slug}" group exists '
            "before proceeding. Continue?",
            abort=True,
        )
        gitlab_private_token = gitlab_private_token or click.prompt(
            "Gitlab private token (with API scope enabled)", hide_input=True
        )
    BootstrapHandler(
        output_dir,
        project_name,
        project_slug,
        project_dirname,
        service_name,
        service_slug,
        use_gitlab,
        gitlab_group_slug,
        gitlab_private_token,
    ).run()


if __name__ == "__main__":
    init_handler()
