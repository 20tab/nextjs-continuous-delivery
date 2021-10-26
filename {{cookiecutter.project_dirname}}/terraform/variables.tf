variable "k8s_cluster_certificate" {
  description = "The Kubernetes cluster certificate."
  type        = string
  sensitive   = true
}

variable "k8s_cluster_host" {
  description = "The Kubernetes cluster host."
  type        = string
}

variable "k8s_cluster_token" {
  description = "The Kubernetes cluster token."
  type        = string
}

variable "environment" {
  type        = string
  description = "The name of the deploy environment, e.g. \"Production\"."
}

variable "internal_api_url" {
  description = "The internal API url."
  type        = string
}

variable "project_url" {
  description = "The project url."
  type        = string
}

variable "service_container_image" {
  description = "The service container image."
  type        = string
}

variable "service_container_port" {
  description = "The service container port."
  type        = number
  default     = 3000
}

variable "service_replicas" {
  description = "The desired numbers of replicas to deploy."
  type        = number
  default     = 1
}
