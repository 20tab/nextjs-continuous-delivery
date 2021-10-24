#!/usr/bin/env python
"""Initialize a web project Next.js service based on a template."""

import os
import shutil
import subprocess
from functools import partial
from pathlib import Path

import click
from cookiecutter.main import cookiecutter
from slugify import slugify

GITLAB_TOKEN_ENV_VAR = "GITLAB_PRIVATE_TOKEN"
OUTPUT_BASE_DIR = os.getenv("OUTPUT_BASE_DIR")


warning = partial(click.style, fg="yellow")


def init_service(
    service_dir,
    project_dirname,
    project_name,
    project_slug,
    service_slug,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    output_dir,
):
    """Initialize the service."""
    if Path(service_dir).is_dir() and click.confirm(
        f'A directory "{service_dir}" already exists and ' "must be deleted. Continue?"
    ):
        shutil.rmtree(service_dir)
    """Initialize the service project."""
    cookiecutter(
        ".",
        extra_context={
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
    env_path = Path(service_dir) / Path(".env_template")
    env_template = env_path.read_text()
    env_path.write_text(env_template)


def init_gitlab(
    gitlab_group_slug,
    gitlab_private_token,
    project_name,
    project_slug,
    service_dir,
    service_slug,
    create_group_variables,
    sentry_dsn,
    digitalocean_token,
):
    """Initialize the Gitlab repositories."""
    env = {
        "TF_VAR_create_group_variables": create_group_variables and "true" or "false",
        "TF_VAR_digitalocean_token": digitalocean_token,
        "TF_VAR_gitlab_group_slug": gitlab_group_slug,
        "TF_VAR_gitlab_token": gitlab_private_token,
        "TF_VAR_project_name": project_name,
        "TF_VAR_project_slug": project_slug,
        "TF_VAR_sentry_dsn": sentry_dsn,
        "TF_VAR_service_dir": service_dir,
        "TF_VAR_service_slug": service_slug,
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


def change_output_owner(service_dir, user_id):
    """Change the owner of the output directory recursively."""
    user_id is not None and subprocess.run(f"chown -R {user_id} {service_dir}")


def slugify_option(ctx, param, value):
    """Slugify an option value."""
    return value and slugify(value)


@click.command()
@click.option("--output-dir", default=".", required=OUTPUT_BASE_DIR is None)
@click.option("--project-name", prompt=True)
@click.option("--project-slug", callback=slugify_option)
@click.option("--service-slug", callback=slugify_option)
@click.option("--project-dirname")
@click.option("--project-url-dev")
@click.option("--project-url-stage")
@click.option("--project-url-prod")
@click.option("--digitalocean-token")
@click.option("--sentry-dsn")
@click.option("--use-gitlab/--no-gitlab", is_flag=True, default=None)
@click.option("--create-group-variables", is_flag=True, default=None)
@click.option("--gitlab-private-token", envvar=GITLAB_TOKEN_ENV_VAR)
@click.option("--gitlab-group-slug")
def run(
    output_dir,
    project_name,
    project_slug,
    service_slug,
    project_dirname,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    digitalocean_token,
    sentry_dsn,
    use_gitlab,
    create_group_variables,
    gitlab_private_token,
    gitlab_group_slug,
):
    """Init the bootstrap handler."""
    project_slug = slugify(
        project_slug or click.prompt("Project slug", default=slugify(project_name)),
    )
    service_slug = slugify(
        service_slug or click.prompt("Service slug", default="nextjs"),
    )
    project_dirname = project_dirname or click.prompt(
        "Project dirname",
        default=service_slug,
        type=click.Choice([service_slug, project_slug]),
    )
    project_url_dev = project_url_dev or click.prompt(
        "Development environment complete URL",
        default=f"dev.{project_slug}.com",
        type=str,
    )
    project_url_stage = project_url_stage or click.prompt(
        "Staging environment complete URL",
        default=f"stage.{project_slug}.com",
        type=str,
    )
    project_url_prod = project_url_prod or click.prompt(
        "Production environment complete URL",
        default=f"www.{project_slug}.com",
        type=str,
    )
    output_dir = OUTPUT_BASE_DIR or output_dir
    service_dir = (Path(output_dir) / Path(project_dirname)).resolve()
    init_service(
        service_dir,
        project_dirname,
        project_name,
        project_slug,
        service_slug,
        project_url_dev,
        project_url_stage,
        project_url_prod,
        output_dir,
    )
    create_env_file(service_dir)
    use_gitlab = (
        use_gitlab
        if use_gitlab is not None
        else click.confirm(warning("Do you want to configure Gitlab?"), default=True)
    )
    if use_gitlab:
        gitlab_group_slug = gitlab_group_slug or click.prompt(
            "Gitlab group slug", default=project_slug
        )
        click.confirm(
            warning(
                f'Make sure the Gitlab "{gitlab_group_slug}" group exists '
                "before proceeding. Continue?",
            ),
            abort=True,
        )
        gitlab_private_token = gitlab_private_token or click.prompt(
            "Gitlab private token (with API scope enabled)", hide_input=True
        )
        create_group_variables = (
            create_group_variables
            if create_group_variables is not None
            else click.confirm(
                warning("Do you want to create Gitlab group variables?"),
                default=False,
            )
        )
        if create_group_variables:
            sentry_dsn = sentry_dsn or click.prompt(
                "Sentry DSN (leave blank if unused)", hide_input=True, default=""
            )
            digitalocean_token = digitalocean_token or click.prompt(
                "DigitalOcean token", hide_input=True
            )
        init_gitlab(
            gitlab_group_slug,
            gitlab_private_token,
            project_name,
            project_slug,
            service_dir,
            service_slug,
            create_group_variables,
            sentry_dsn,
            digitalocean_token,
        )


if __name__ == "__main__":
    run()
