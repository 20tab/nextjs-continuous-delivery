locals {
  project_name = "{{ cookiecutter.project_name }}"
  project_slug = "{{ cookiecutter.project_slug }}"
  service_slug = "{{ cookiecutter.service_slug }}"

  environment_slug = { development = "dev", staging = "stage", production = "prod" }[lower(var.environment)]

  namespace = "${local.project_slug}-${local.environment_slug}"

  cluster_prefix = var.stack_slug == "main" ? local.project_slug : "${local.project_slug}-${var.stack_slug}"

  service_labels = {
    component   = local.service_slug
    environment = var.environment
    project     = local.project_slug
    terraform   = "true"
  }

  service_container_port = coalesce(var.service_container_port, "{{ cookiecutter.internal_service_port }}")
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
      version = "2.8.0"
    }
  }
}

/* Providers */

provider "digitalocean" {
  token = var.digitalocean_token
}

provider "kubernetes" {
  host  = data.digitalocean_kubernetes_cluster.main.endpoint
  token = data.digitalocean_kubernetes_cluster.main.kube_config[0].token
  cluster_ca_certificate = base64decode(
    data.digitalocean_kubernetes_cluster.main.kube_config[0].cluster_ca_certificate
  )
}

/* Data Sources */

data "digitalocean_kubernetes_cluster" "main" {
  name = "${local.cluster_prefix}-k8s-cluster"
}

/* Config Map */

resource "kubernetes_config_map_v1" "env" {
  metadata {
    name      = "${local.service_slug}-env"
    namespace = local.namespace
  }

  data = {
    INTERNAL_BACKEND_URL    = var.internal_backend_url
    PORT                    = local.service_container_port
    NEXT_PUBLIC_PROJECT_URL = var.project_url
    REACT_ENVIRONMENT       = var.environment
  }
}

/* Deployment */

resource "kubernetes_deployment_v1" "main" {

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
            container_port = local.service_container_port
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map_v1.env.metadata[0].name
            }
          }
        }
      }
    }
  }
}

/* Cluster IP */

resource "kubernetes_service_v1" "cluster_ip" {

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
      port        = local.service_container_port
      target_port = local.service_container_port
    }

  }
}
