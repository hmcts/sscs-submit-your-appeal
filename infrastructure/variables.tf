variable "product" {}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

variable "ilbIp" {}
variable "deployment_namespace" {}

variable "node_environment" {
  default = "sandbox"
}

variable "common_tags" {
  type = map(string)
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}
