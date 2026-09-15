variable "product" {
    default = "SSCS"
}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

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

variable "family" {
  default     = "C"
  description = "The SKU family/pricing group to use. Valid values are `C` (for Basic/Standard SKU family) and `P` (for Premium). Use P for higher availability, but beware it costs a lot more."
}

variable "sku_name" {
  default     = "Basic"
  description = "The SKU of Redis to use. Possible values are `Basic`, `Standard` and `Premium`."
}

variable "capacity" {
  default     = "1"
  description = "The size of the Redis cache to deploy. Valid values are 1, 2, 3, 4, 5"
}

variable "private_dns_subscription_id" {
  type        = string
  description = "Subscription ID containing the shared HMCTS private DNS zones."
  default     = "1baf5470-1c3e-40d3-a6f7-74bfbce4b348"
}

variable "managed_redis_sku" {
  description = "Managed Redis SKU. Override per environment in <env>.tfvars."
  type        = string
  default     = "Balanced_B0"
}

variable "managed_redis_high_availability_enabled" {
  description = "Managed Redis high availability. Override per environment in <env>.tfvars."
  type        = bool
  default     = false
}