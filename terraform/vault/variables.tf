variable "project_path" {
  description = "The project path."
  type        = string
}

variable "secrets" {
  description = "The service secrets."
  type        = map(map(string))
  default     = {}
}
