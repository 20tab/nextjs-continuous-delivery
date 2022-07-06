locals {
  service_labels = {
    component   = var.service_slug
    environment = var.environment
    project     = var.project_slug
    terraform   = "true"
  }
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
    name      = "${var.service_slug}-env-vars"
    namespace = var.namespace
  }

  data = { for k, v in merge(
    var.extra_secret_values,
    {
      NEXT_PUBLIC_SENTRY_DSN = var.sentry_dsn
    }
  ) : k => v if v != "" }
}

/* Config Map */

resource "kubernetes_config_map_v1" "main" {
  metadata {
    name      = "${var.service_slug}-env-vars"
    namespace = var.namespace
  }

  data = { for k, v in merge(
    var.extra_config_values,
    {
      INTERNAL_BACKEND_URL    = var.internal_backend_url
      PORT                    = var.service_container_port
      NEXT_PUBLIC_PROJECT_URL = var.project_url
      REACT_ENVIRONMENT       = var.environment
    }
  ) : k => v if v != "" }
}

/* Deployment */

resource "kubernetes_deployment_v1" "main" {
  metadata {
    name      = var.service_slug
    namespace = var.namespace
    annotations = {
      "reloader.stakater.com/auto" = "true"
    }
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
          name  = var.service_slug
          port {
            container_port = var.service_container_port
          }
          env_from {
            config_map_ref {
              name = kubernetes_config_map_v1.main.metadata[0].name
            }
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
    name      = var.service_slug
    namespace = var.namespace
  }
  spec {
    type = "ClusterIP"
    selector = {
      component = var.service_slug
    }
    port {
      port        = var.service_container_port
      target_port = var.service_container_port
    }
  }
}
