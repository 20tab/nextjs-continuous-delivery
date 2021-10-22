variable "digitalocean_token" {
  description = "The DigitalOcean access token."
  type        = string
  sensitive   = true
}

variable "digitalocean_cluster_name" {
  description = "The DigitalOcean cluster name."
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

variable "project_domain" {
  description = "The project domain."
  type        = string
}

variable "project_protocol" {
  description = "The project protocol."
  type        = string
  default     = "https"
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
