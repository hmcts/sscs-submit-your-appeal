variable "product" {}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "sya_hostname" {
  default = "localhost"
}

variable "subscription" {}

variable "ilbIp" {}
variable "deployment_namespace" {}

variable "node_environment" {
  default = "sandbox"
}

variable "node_path" {
  default = "."
}

variable "common_tags" {
  type = "map"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}
