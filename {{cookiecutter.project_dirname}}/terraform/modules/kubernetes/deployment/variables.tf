variable "environment" {
  type        = string
  description = "The deploy environment name, e.g. \"Production\"."
}

variable "extra_config_values" {
  type        = map(string)
  description = "Additional config map environment variables."
  default     = {}
}

variable "extra_secret_values" {
  type        = map(string)
  description = "Additional secret environment variables."
  default     = {}
  sensitive   = true
}

variable "internal_backend_url" {
  description = "The internal backend url."
  type        = string
}

variable "namespace" {
  description = "The Kubernetes namespace."
  type        = string
}

variable "project_slug" {
  description = "The project slug."
  type        = string
}

variable "project_url" {
  description = "The project url."
  type        = string
}

variable "sentry_dsn" {
  description = "The Sentry project DSN."
  type        = string
  default     = ""
  sensitive   = true
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