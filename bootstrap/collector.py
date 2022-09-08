#!/usr/bin/env python
"""Initialize a web project Next.js service based on a template."""

from functools import partial
from shutil import rmtree

import click
import validators
from slugify import slugify

from bootstrap.constants import (
    DEPLOYMENT_TYPE_CHOICES,
    DEPLOYMENT_TYPE_DIGITALOCEAN,
    DEPLOYMENT_TYPE_OTHER,
    ENVIRONMENT_DISTRIBUTION_CHOICES,
    ENVIRONMENT_DISTRIBUTION_DEFAULT,
    ENVIRONMENT_DISTRIBUTION_PROMPT,
    GITLAB_URL_DEFAULT,
    TERRAFORM_BACKEND_CHOICES,
    TERRAFORM_BACKEND_TFC,
)

error = partial(click.style, fg="red")

warning = partial(click.style, fg="yellow")


def collect(
    uid,
    gid,
    output_dir,
    project_name,
    project_slug,
    project_dirname,
    service_slug,
    internal_backend_url,
    internal_service_port,
    deployment_type,
    terraform_backend,
    terraform_cloud_hostname,
    terraform_cloud_token,
    terraform_cloud_organization,
    terraform_cloud_organization_create,
    terraform_cloud_admin_email,
    vault_token,
    vault_url,
    environment_distribution,
    project_url_dev,
    project_url_stage,
    project_url_prod,
    sentry_dsn,
    sentry_org,
    sentry_url,
    use_redis,
    gitlab_url,
    gitlab_private_token,
    gitlab_group_slug,
    terraform_dir,
    logs_dir,
    quiet,
):
    """Collect options and run the setup."""
    project_slug = clean_project_slug(project_name, project_slug)
    service_slug = clean_service_slug(service_slug)
    project_dirname = clean_project_dirname(project_dirname, project_slug, service_slug)
    service_dir = clean_service_dir(output_dir, project_dirname)
    deployment_type = clean_deployment_type(deployment_type)
    (
        terraform_backend,
        terraform_cloud_hostname,
        terraform_cloud_token,
        terraform_cloud_organization,
        terraform_cloud_organization_create,
        terraform_cloud_admin_email,
    ) = clean_terraform_backend(
        terraform_backend,
        terraform_cloud_hostname,
        terraform_cloud_token,
        terraform_cloud_organization,
        terraform_cloud_organization_create,
        terraform_cloud_admin_email,
    )
    vault_token, vault_url = clean_vault_data(vault_token, vault_url, quiet)
    environment_distribution = clean_environment_distribution(
        environment_distribution, deployment_type
    )
    project_url_dev = validate_or_prompt_url(
        "Development environment complete URL",
        project_url_dev,
        default=f"https://dev.{project_slug}.com/",
        required=False,
    )
    project_url_stage = validate_or_prompt_url(
        "Staging environment complete URL",
        project_url_stage,
        default=f"https://stage.{project_slug}.com/",
        required=False,
    )
    project_url_prod = validate_or_prompt_url(
        "Production environment complete URL",
        project_url_prod,
        default=f"https://www.{project_slug}.com/",
        required=False,
    )
    use_redis = clean_use_redis(use_redis)
    gitlab_url, gitlab_group_slug, gitlab_private_token = clean_gitlab_group_data(
        project_slug,
        gitlab_url,
        gitlab_group_slug,
        gitlab_private_token,
        quiet,
    )
    if gitlab_group_slug:
        (sentry_org, sentry_url, sentry_dsn) = clean_sentry_data(
            sentry_org, sentry_url, sentry_dsn
        )
    return {
        "uid": uid,
        "gid": gid,
        "output_dir": output_dir,
        "project_name": project_name,
        "project_slug": project_slug,
        "project_dirname": project_dirname,
        "service_dir": service_dir,
        "service_slug": service_slug,
        "internal_backend_url": internal_backend_url,
        "internal_service_port": internal_service_port,
        "deployment_type": deployment_type,
        "terraform_backend": terraform_backend,
        "terraform_cloud_hostname": terraform_cloud_hostname,
        "terraform_cloud_token": terraform_cloud_token,
        "terraform_cloud_organization": terraform_cloud_organization,
        "terraform_cloud_organization_create": terraform_cloud_organization_create,
        "terraform_cloud_admin_email": terraform_cloud_admin_email,
        "vault_token": vault_token,
        "vault_url": vault_url,
        "environment_distribution": environment_distribution,
        "project_url_dev": project_url_dev,
        "project_url_stage": project_url_stage,
        "project_url_prod": project_url_prod,
        "sentry_dsn": sentry_dsn,
        "sentry_org": sentry_org,
        "sentry_url": sentry_url,
        "use_redis": use_redis,
        "gitlab_url": gitlab_url,
        "gitlab_private_token": gitlab_private_token,
        "gitlab_group_slug": gitlab_group_slug,
        "terraform_dir": terraform_dir,
        "logs_dir": logs_dir,
    }


def validate_or_prompt_domain(message, value=None, default=None, required=True):
    """Validate the given domain or prompt until a valid value is provided."""
    if value is None:
        value = click.prompt(message, default=default)
    try:
        if not required and value == "" or validators.domain(value):
            return value
    except validators.ValidationFailure:
        pass
    click.echo(error("Please type a valid domain!"))
    return validate_or_prompt_domain(message, None, default, required)


def validate_or_prompt_email(message, value=None, default=None, required=True):
    """Validate the given email address or prompt until a valid value is provided."""
    if value is None:
        value = click.prompt(message, default=default)
    try:
        if not required and value == "" or validators.email(value):
            return value
    except validators.ValidationFailure:
        pass
    click.echo(error("Please type a valid email!"))
    return validate_or_prompt_email(message, None, default, required)


def validate_or_prompt_url(message, value=None, default=None, required=True):
    """Validate the given URL or prompt until a valid value is provided."""
    if value is None:
        value = click.prompt(message, default=default)
    try:
        if not required and value == "" or validators.url(value):
            return value.strip("/")
    except validators.ValidationFailure:
        pass
    click.echo(error("Please type a valid URL!"))
    return validate_or_prompt_url(message, None, default, required)


def validate_or_prompt_password(message, value=None, default=None, required=True):
    """Validate the given password or prompt until a valid value is provided."""
    if value is None:
        value = click.prompt(message, default=default, hide_input=True)
    try:
        if not required and value == "" or validators.length(value, min=8):
            return value
    except validators.ValidationFailure:
        pass
    click.echo(error("Please type at least 8 chars!"))
    return validate_or_prompt_password(message, None, default, required)


def clean_project_slug(project_name, project_slug):
    """Return the project slug."""
    return slugify(
        project_slug or click.prompt("Project slug", default=slugify(project_name))
    )


def clean_service_slug(service_slug):
    """Return the service slug."""
    return slugify(
        service_slug or click.prompt("Service slug", default="frontend"),
        separator="",
    )


def clean_project_dirname(project_dirname, project_slug, service_slug):
    """Return the project directory name."""
    project_dirname_choices = [service_slug, slugify(project_slug, separator="")]
    return project_dirname or click.prompt(
        "Project dirname",
        default=project_dirname_choices[0],
        type=click.Choice(project_dirname_choices),
    )


def clean_service_dir(output_dir, project_dirname):
    """Return the service directory."""
    service_dir = output_dir / project_dirname
    if service_dir.is_dir() and click.confirm(
        warning(
            f'A directory "{service_dir}" already exists and '
            "must be deleted. Continue?",
        ),
        abort=True,
    ):
        rmtree(service_dir)
    return service_dir


def clean_deployment_type(deployment_type):
    """Return the deployment type."""
    return (
        deployment_type
        if deployment_type in DEPLOYMENT_TYPE_CHOICES
        else click.prompt(
            "Deploy type",
            default=DEPLOYMENT_TYPE_DIGITALOCEAN,
            type=click.Choice(DEPLOYMENT_TYPE_CHOICES, case_sensitive=False),
        )
    ).lower()


def clean_terraform_backend(
    terraform_backend,
    terraform_cloud_hostname,
    terraform_cloud_token,
    terraform_cloud_organization,
    terraform_cloud_organization_create,
    terraform_cloud_admin_email,
):
    """Return the terraform backend and the Terraform Cloud data, if applicable."""
    terraform_backend = (
        terraform_backend
        if terraform_backend in TERRAFORM_BACKEND_CHOICES
        else click.prompt(
            "Terraform backend",
            default=TERRAFORM_BACKEND_TFC,
            type=click.Choice(TERRAFORM_BACKEND_CHOICES, case_sensitive=False),
        )
    ).lower()
    if terraform_backend == TERRAFORM_BACKEND_TFC:
        terraform_cloud_hostname = validate_or_prompt_domain(
            "Terraform host name", terraform_cloud_hostname, default="app.terraform.io"
        )
        terraform_cloud_token = validate_or_prompt_password(
            "Terraform Cloud User token", terraform_cloud_token
        )
        terraform_cloud_organization = terraform_cloud_organization or click.prompt(
            "Terraform Organization"
        )
        terraform_cloud_organization_create = (
            terraform_cloud_organization_create
            if terraform_cloud_organization_create is not None
            else click.confirm(
                "Do you want to create Terraform Cloud Organization "
                f"'{terraform_cloud_organization}'?",
            )
        )
        if terraform_cloud_organization_create:
            terraform_cloud_admin_email = validate_or_prompt_email(
                "Terraform Cloud Organization admin email (e.g. tech@20tab.com)",
                terraform_cloud_admin_email,
            )
        else:
            terraform_cloud_admin_email = None
    else:
        terraform_cloud_organization = None
        terraform_cloud_hostname = None
        terraform_cloud_token = None
        terraform_cloud_organization_create = None
        terraform_cloud_admin_email = None
    return (
        terraform_backend,
        terraform_cloud_hostname,
        terraform_cloud_token,
        terraform_cloud_organization,
        terraform_cloud_organization_create,
        terraform_cloud_admin_email,
    )


def clean_vault_data(vault_token, vault_url, quiet=False):
    """Return the Vault data, if applicable."""
    if vault_token or (
        vault_token is None
        and click.confirm(
            "Do you want to use Vault for secrets management?",
        )
    ):
        vault_token = validate_or_prompt_password("Vault token", vault_token)
        quiet or click.confirm(
            warning(
                "Make sure the Vault token has enough permissions to enable the "
                "project secrets backends and manage the project secrets. Continue?"
            ),
            abort=True,
        )
        vault_url = validate_or_prompt_url("Vault address", vault_url)
    else:
        vault_token = None
        vault_url = None
    return vault_token, vault_url


def clean_environment_distribution(environment_distribution, deployment_type):
    """Return the environment distribution."""
    if deployment_type == DEPLOYMENT_TYPE_OTHER:
        return "1"
    return (
        environment_distribution
        if environment_distribution in ENVIRONMENT_DISTRIBUTION_CHOICES
        else click.prompt(
            ENVIRONMENT_DISTRIBUTION_PROMPT,
            default=ENVIRONMENT_DISTRIBUTION_DEFAULT,
            type=click.Choice(ENVIRONMENT_DISTRIBUTION_CHOICES),
        )
    )


def clean_sentry_data(
    sentry_org,
    sentry_url,
    sentry_dsn,
):
    """Return the Sentry configuration data."""
    if sentry_org or (
        sentry_org is None
        and click.confirm(warning("Do you want to use Sentry?"), default=False)
    ):
        sentry_org = clean_sentry_org(sentry_org)
        sentry_url = validate_or_prompt_url(
            "Sentry URL", sentry_url, default="https://sentry.io/"
        )
        sentry_dsn = clean_sentry_dsn(sentry_dsn)
    else:
        sentry_org = None
        sentry_url = None
        sentry_dsn = None
    return (
        sentry_org,
        sentry_url,
        sentry_dsn,
    )


def clean_sentry_org(sentry_org):
    """Return the Sentry organization."""
    return sentry_org if sentry_org is not None else click.prompt("Sentry organization")


def clean_sentry_dsn(sentry_dsn):
    """Return the Sentry DSN."""
    return validate_or_prompt_url(
        "Sentry DSN (leave blank if unused)", sentry_dsn, default="", required=False
    )


def clean_use_redis(use_redis):
    """Tell whether Redis should be used."""
    if use_redis is None:
        return click.confirm(warning("Do you want to configure Redis?"), default=False)
    return use_redis


def clean_gitlab_group_data(
    project_slug,
    gitlab_url,
    gitlab_group_slug,
    gitlab_private_token,
    quiet=False,
):
    """Return GitLab group data."""
    if gitlab_group_slug or (
        gitlab_group_slug is None
        and click.confirm(warning("Do you want to use GitLab?"), default=True)
    ):
        gitlab_url = validate_or_prompt_url(
            "GitLab URL", gitlab_url, default=GITLAB_URL_DEFAULT
        )
        gitlab_group_slug = slugify(
            gitlab_group_slug or click.prompt("GitLab group slug", default=project_slug)
        )
        quiet or click.confirm(
            warning(
                f'Make sure the GitLab "{gitlab_group_slug}" group exists '
                "before proceeding. Continue?"
            ),
            abort=True,
        )
        gitlab_private_token = gitlab_private_token or click.prompt(
            "GitLab private token (with API scope enabled)", hide_input=True
        )
    else:
        gitlab_url = None
        gitlab_group_slug = None
        gitlab_private_token = None
    return (gitlab_url, gitlab_group_slug, gitlab_private_token)
