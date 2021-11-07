locals {
  project_name = "{{ cookiecutter.project_name }}"
  project_slug = "{{ cookiecutter.project_slug }}"
  service_slug = "{{ cookiecutter.service_slug }}"

  environment_slug = { development = "dev", staging = "stage", production = "prod" }[lower(var.environment)]

  namespace = "${local.project_slug}-${local.environment_slug}"

  service_labels = {
    component   = local.service_slug
    environment = var.environment
    project     = local.project_slug
    terraform   = "true"
  }
}

terraform {
  backend "http" {
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.6.0"
    }
  }
}

/* Providers */

provider "kubernetes" {
}

/* Config Map */

resource "kubernetes_config_map" "env" {
  metadata {
    name      = "${local.service_slug}-env"
    namespace = local.namespace
  }

  data = {
    INTERNAL_URL        = var.internal_url
    NEXT_PUBLIC_PROJECT_URL = var.project_url
    REACT_ENVIRONMENT       = var.environment
  }
}

/* Deployment */

resource "kubernetes_deployment" "main" {

  metadata {
    name      = local.service_slug
    namespace = local.namespace
  }

  spec {
    replicas = var.service_replicas

    selector {
      match_labels = local.service_labels
    }

    template {

      metadata {
        labels = local.service_labels
      }

      spec {

        image_pull_secrets {
          name = "regcred"
        }

        container {
          image = var.service_container_image
          name  = local.service_slug

          port {
            container_port = var.service_container_port
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.env.metadata[0].name
            }
          }
        }
      }
    }
  }
}

/* Cluster IP */

resource "kubernetes_service" "cluster_ip" {

  metadata {
    name      = local.service_slug
    namespace = local.namespace
  }

  spec {
    type = "ClusterIP"
    selector = {
      component = local.service_slug
    }

    port {
      port        = var.service_container_port
      target_port = var.service_container_port
    }

  }
}
