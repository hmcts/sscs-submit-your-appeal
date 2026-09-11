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

data "azurerm_subnet" "redis_private_endpoint" {
  name                 = "core-infra-subnet-2-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
}

module "redis-cache" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=4.x"
  product                       = var.product
  location                      = var.location
  common_tags                   = var.common_tags
  env                           = var.env
  redis_version                 = "6"
  business_area                 = "cft"
  public_network_access_enabled = false
  private_endpoint_enabled      = true
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity
}

module "managed_redis" {
  # foreach conditional allows selective deployment to desired environments
  for_each = toset(contains(["ithc"], var.env) ? [var.env] : [])
  source   = "git@github.com:hmcts/terraform-module-azure-managed-redis?ref=main"

  product     = var.product
  component   = var.component
  env         = var.env
  location    = var.location
  common_tags = var.common_tags

  # Performance:
  sku_name          = var.managed_redis_sku
  high_availability_enabled = var.managed_redis_high_availability_enabled
  # Networking:
  public_network_access   = "Disabled"
  create_private_endpoint = true
  subnet_id               = data.azurerm_subnet.redis_private_endpoint.id
  private_dns_zone_ids    = ["/subscriptions/${var.private_dns_subscription_id}/resourceGroups/core-infra-intsvc-rg/providers/Microsoft.Network/privateDnsZones/privatelink.redis.azure.net"]

  access_keys_authentication_enabled = true
  persistence_rdb_backup_frequency   = "6h"
}


resource "azurerm_key_vault_secret" "managed_redis_access_key" {
  name         = "managed-redis-access-key"
  value        = module.managed_redis.primary_access_key
  key_vault_id = data.azurerm_key_vault.sscs_key_vault.id

  content_type = "secret"
  tags = merge(var.common_tags, {
    "source" : "managed-redis ${module.managed_redis.hostname}"
  })
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
