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
  name = var.digitalocean_cluster_name
}


/* Deployment */

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
        }
      }
    }
  }
}

/* Cluster IP */

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
