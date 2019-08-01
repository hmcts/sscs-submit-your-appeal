variable "product" {
  type    = "string"
}

variable "component" {
  type    = "string"
}

variable "location" {
  type    = "string"
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "subscription" {
  type = "string"
}

variable "ilbIp"{}

variable "infrastructure_env" {
  default     = "dev"
  description = "Infrastructure environment to point to"
}

variable "sya_server_port" {
  default = "3000"
}

variable "node_environment" {
  default = "sandbox"
}

variable "sya_hostname" {
  default = "localhost"
}

variable "deployment_namespace" {
  type = "string"
}
variable "common_tags" {
  type = "map"
}

variable "evidence_upload_enabled" {
  type = "string"
  default = "false"
}

variable "https_only_flag" {
  type = "string"
  default = "true"
}

variable "postcode_checker_enabled" {
  type = "string"
  default = ""
}

variable "postcode_checker_allowed_rpcs" {
  type = "string"
  default = "birmingham"
}

variable "raw_product" {
  default = "sscs"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default     = ""
}

variable "postcode_lookup_enabled" {
  type = "string"
  default = ""
}

variable "allow_save_return" {
  type = "string"
  default = "false"
}

variable "allow_contact_us" {
  type = "string"
  default = "true"
}

variable "contact_us_telephone_enabled" {
  type = "string"
  default = "true"
}
variable "idam_login_url" {
  type = "string"
  default = ""
}
variable "contact_us_webchat_enabled" {
  type = "string"
  default = "true"
}

variable "idam_api_url" {
  type = "string"
  default = ""
}

variable "services_web_form" {
  type = "string"
  default = ""
}

variable "services_webchat_uuid" {
  type = "string"
  default = ""
}

variable "contact_us_web_form_enabled" {
  type = "string"
  default = "true"
}
variable "services_webchat_tenant" {
  type = "string"
  default = ""
}

variable "services_webchat_channel" {
  type = "string"
  default = ""
}



