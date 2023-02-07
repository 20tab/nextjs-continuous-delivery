variable "digitalocean_token" {
  description = "The Digital Ocean access token."
  type        = string
  sensitive   = true
}

variable "internal_backend_url" {
  description = "The internal backend url."
  type        = string
  default     = ""
}

variable "environment" {
  type        = string
  description = "The name of the deploy environment, e.g. \"Production\"."
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
  default     = null
}

variable "service_limits_memory" {
  description = "The service limits memory value."
  type        = string
  default     = null
}

variable "service_replicas" {
  description = "The desired numbers of replicas to deploy."
  type        = number
  default     = 1
}

variable "service_requests_cpu" {
  description = "The service requests cpu value."
  type        = string
  default     = null
}

variable "service_requests_memory" {
  description = "The service requests memory value."
  type        = string
  default     = null
}

variable "service_slug" {
  description = "The service slug."
  type        = string
}

variable "stack_slug" {
  description = "The slug of the stack where the service is deployed."
  type        = string
}
