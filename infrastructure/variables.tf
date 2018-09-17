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
