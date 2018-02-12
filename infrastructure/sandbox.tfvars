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

variable "tribunals_case_api" {
  default = "http://sscs-tribunals-api-${var.env}-staging.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
}

variable "sya_hostname" {
  default = "benefit-appeal.demo.platform.hmcts.net"
}
