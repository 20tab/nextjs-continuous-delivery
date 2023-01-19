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
  default     = ""
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
  default     = "{{ cookiecutter.internal_service_port }}"
}

variable "service_limits_cpu" {
  description = "The service limits cpu value."
  type        = string
}

variable "service_limits_memory" {
  description = "The service limits memory value."
  type        = string
}

variable "service_replicas" {
  description = "The desired numbers of replicas to deploy."
  type        = number
  default     = 1
}

variable "service_requests_cpu" {
  description = "The service requests cpu value."
  type        = string
}

variable "service_requests_memory" {
  description = "The service requests memory value."
  type        = string
}

variable "service_slug" {
  description = "The service slug."
  type        = string
}
