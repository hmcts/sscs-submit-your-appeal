variable "product" {
  type    = "string"
  default = "sscs-tribunals"
}

variable "location" {
  type    = "string"
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "infrastructure_env" {
  default     = "dev"
  description = "Infrastructure environment to point to"
}

variable "subscription" {
  type = "string"
}

variable "ilbIp"{}

variable "sya_server_port" {
  default = "3000"
}

variable "node_environment" {
  default = "sandbox"
}


