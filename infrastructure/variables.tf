variable "product" {}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

variable "ilbIp" {}

variable "node_environment" {
  default = "sandbox"
}

variable "sya_hostname" {
  default = "localhost"
}

variable "common_tags" {
  type = "map"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}

variable "idam_login_url" {}

variable "idam_api_url" {}

variable "services_web_form" {
  default = ""
}

variable "services_webchat_uuid" {
  default = ""
}

variable "contact_us_web_form_enabled" {
  default = "true"
}
variable "services_webchat_tenant" {
  default = ""
}
variable "services_webchat_channel" {
  default = ""
}

variable "services_btn_no_agents" {
  default = ""
}

variable "services_btn_agents_busy" {
  default = ""
}

variable "services_btn_service_closed" {
  default = ""
}




