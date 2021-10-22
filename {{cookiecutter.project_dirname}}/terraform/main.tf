locals {
  project_name     = "{{ cookiecutter.project_name }}"
  project_slug     = "{{ cookiecutter.project_slug }}"
  environment_slug = { development = "dev", staging = "stage", production = "prod" }[lower(var.environment)]

  service_slug = "${local.project_slug}-${local.environment_slug}-{{ cookiecutter.service_slug }}"
  service_labels = {
    component   = local.service_slug
    domain      = var.project_domain
    environment = var.environment
    project     = local.project_name
    terraform   = "true"
  }
}

terraform {
  backend "http" {
  }

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.6.0"
    }
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

data "digitalocean_kubernetes_cluster" "main" {
  name = var.digitalocean_cluster_name
}

provider "kubernetes" {
  host  = data.digitalocean_kubernetes_cluster.main.endpoint
  token = data.digitalocean_kubernetes_cluster.main.kube_config[0].token
  cluster_ca_certificate = base64decode(
    data.digitalocean_kubernetes_cluster.main.kube_config[0].cluster_ca_certificate
  )
}

resource "kubernetes_deployment" "frontend" {

  metadata {
    name      = "${local.service_slug}-deployment"
    namespace = "${local.project_slug}-development"
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

          env {
            name = "BASIC_AUTH_USER"

            value_from {

              secret_key_ref {
                key  = "BASIC_AUTH_USER"
                name = "secrets"
              }
            }
          }

          env {
            name = "BASIC_AUTH_PASSWORD"

            value_from {

              secret_key_ref {
                key  = "BASIC_AUTH_PASSWORD"
                name = "secrets"
              }
            }
          }

          env {
            name  = "INTERNAL_API_URL"
            value = var.internal_api_url
          }

          env {
            name  = "NEXT_PUBLIC_PROJECT_URL"
            value = var.project_url
          }

          env {
            name  = "REACT_ENVIRONMENT"
            value = var.environment
          }

          # resources {
          #   limits = {
          #     cpu    = "0.5"
          #     memory = "512Mi"
          #   }
          #   requests = {
          #     cpu    = "250m"
          #     memory = "50Mi"
          #   }
          # }

          # liveness_probe {
          #   http_get {
          #     path = "/nginx_status"
          #     port = 80

          #     http_header {
          #       name  = "X-Custom-Header"
          #       value = "Awesome"
          #     }
          #   }

          #   initial_delay_seconds = 3
          #   period_seconds        = 3
          # }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend_cluster_ip" {

  metadata {
    name      = "${local.service_slug}-cluster-ip-service"
    namespace = "${local.project_slug}-development"
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
