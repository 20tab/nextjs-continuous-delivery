variable "digitalocean_token" {
  description = "The Digital Ocean access token."
  type        = string
  sensitive   = true
}

variable "environment" {
  type        = string
  description = "The name of the deploy environment, e.g. \"Production\"."
}

variable "internal_backend_url" {
  description = "The internal backend url."
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
  type        = string
  default     = ""
}

variable "service_replicas" {
  description = "The desired numbers of replicas to deploy."
  type        = number
  default     = 1
}

variable "stacks" {
  description = "The stacks and environments structure as a json string."
  type        = string
}
