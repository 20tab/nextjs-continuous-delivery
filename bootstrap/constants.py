#!/usr/bin/env python
"""Web project initialization CLI constants."""

GITLAB_TOKEN_ENV_VAR = "GITLAB_PRIVATE_TOKEN"

# Deployment type

DEPLOYMENT_TYPE_DIGITALOCEAN = "digitalocean-k8s"

DEPLOYMENT_TYPE_OTHER = "other-k8s"

DEPLOYMENT_TYPE_CHOICES = [DEPLOYMENT_TYPE_DIGITALOCEAN, DEPLOYMENT_TYPE_OTHER]

# Environments distribution

ENVIRONMENT_DISTRIBUTION_DEFAULT = "1"

ENVIRONMENT_DISTRIBUTION_CHOICES = [ENVIRONMENT_DISTRIBUTION_DEFAULT, "2", "3"]

ENVIRONMENT_DISTRIBUTION_PROMPT = """Choose the environments distribution:
  1 - All environments share the same stack (Default)
  2 - Dev and Stage environments share the same stack, Prod has its own
  3 - Each environment has its own stack
"""

# Terraform backend

TERRAFORM_BACKEND_GITLAB = "gitlab"

TERRAFORM_BACKEND_TFC = "terraform-cloud"

TERRAFORM_BACKEND_CHOICES = [TERRAFORM_BACKEND_GITLAB, TERRAFORM_BACKEND_TFC]
