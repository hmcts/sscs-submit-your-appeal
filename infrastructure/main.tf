provider "azurerm" {
  features {}
}

data "azurerm_key_vault" "sscs_key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}

locals {
  vaultName = "${var.product}-${var.env}"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

module "redis-cache" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product                       = var.product
  location                      = var.location
  common_tags                   = var.common_tags
  env                           = var.env
  name                          = "${var.product}-redis-v6-${var.env}"
  redis_version                 = "6"
  business_area                 = "cft"
  public_network_access_enabled = false
  private_endpoint_enabled      = true
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.product}-redis-access-key"
  value        = module.redis-cache.access_key
  key_vault_id = data.azurerm_key_vault.sscs_key_vault.id
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name         = "${var.product}-redis-connection-string"
  value        = "rediss://:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}"
  key_vault_id = data.azurerm_key_vault.sscs_key_vault.id
}
