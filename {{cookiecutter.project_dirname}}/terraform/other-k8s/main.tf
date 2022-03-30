locals {
  project_name     = "{{ cookiecutter.project_name }}"
  project_slug     = "{{ cookiecutter.project_slug }}"
  environment_slug = { development = "dev", staging = "stage", production = "prod" }[lower(var.environment)]

  namespace = "${local.project_slug}-${local.environment_slug}"

  cluster_prefix = var.stack_slug == "main" ? local.project_slug : "${local.project_slug}-${var.stack_slug}"

  extra_config_values = {}
  extra_secret_values = {}
}

terraform {
  backend "http" {
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.9.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

/* Providers */

provider "kubernetes" {
  host                   = var.kubernetes_host
  token                  = var.kubernetes_token
  cluster_ca_certificate = base64decode(var.kubernetes_cluster_ca_certificate)
}

/* Deployment */

module "deployment" {
  source = "../modules/kubernetes/deployment"

  environment = var.environment

  namespace = local.namespace

  project_slug = local.project_slug
  project_url  = var.project_url

  service_container_image = var.service_container_image
  service_container_port  = var.service_container_port
  service_replicas        = var.service_replicas

  internal_backend_url = var.internal_backend_url
  sentry_dsn           = var.sentry_dsn

  extra_config_values = local.extra_config_values
  extra_secret_values = local.extra_secret_values
}
