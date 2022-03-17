#!/usr/bin/env python
"""Web project initialization CLI constants."""

GITLAB_TOKEN_ENV_VAR = "GITLAB_PRIVATE_TOKEN"

TERRAFORM_BACKEND_DEFAULT = "gitlab"

TERRAFORM_BACKEND_TFC = "terraform-cloud"

TERRAFORM_BACKEND_CHOICES = [TERRAFORM_BACKEND_DEFAULT, TERRAFORM_BACKEND_TFC]
