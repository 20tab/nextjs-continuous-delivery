locals {
  service_slug = "{{ cookiecutter.service_slug }}"

  service_labels = {
    component   = local.service_slug
    environment = var.environment
    project     = var.project_slug
    terraform   = "true"
  }

  service_container_port = coalesce(var.service_container_port, "{{ cookiecutter.internal_service_port }}")
}

terraform {
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

/* Secrets */

resource "kubernetes_secret_v1" "main" {

  metadata {
    name      = "${local.service_slug}-env-vars"
    namespace = var.namespace
  }

  data = { for k, v in merge(
    var.extra_secret_values,
    {

      SENTRY_DSN = var.sentry_dsn
    }
  ) : k => v if v != "" }
}

/* Config Map */

resource "kubernetes_config_map_v1" "main" {
  metadata {
    name      = "${local.service_slug}-env-vars"
    namespace = var.namespace
  }

  data = { for k, v in merge(
    var.extra_config_values,
    {
      INTERNAL_BACKEND_URL    = var.internal_backend_url
      PORT                    = local.service_container_port
      NEXT_PUBLIC_PROJECT_URL = var.project_url
      REACT_ENVIRONMENT       = var.environment
    }
  ) : k => v if v != "" }
}

/* Deployment */

resource "kubernetes_deployment_v1" "main" {
  metadata {
    name      = local.service_slug
    namespace = var.namespace
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
            container_port = local.service_container_port
          }
          env_from {
            secret_ref {
              name = kubernetes_secret_v1.main.metadata[0].name
            }
          }
        }
      }
    }
  }
}

/* Cluster IP Service */

resource "kubernetes_service_v1" "cluster_ip" {
  metadata {
    name      = local.service_slug
    namespace = var.namespace
  }
  spec {
    type = "ClusterIP"
    selector = {
      component = local.service_slug
    }
    port {
      port        = local.service_container_port
      target_port = local.service_container_port
    }
  }
}
