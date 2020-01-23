data "azurerm_key_vault" "sscs_key_vault" {
  name                = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "idam_oauth2_client_secret" {
  name         = "idam-sscs-oauth2-client-secret"
  key_vault_id = "${data.azurerm_key_vault.sscs_key_vault.id}"
}

data "azurerm_key_vault_secret" "postcode_lookup_token" {
  name         = "postcode-lookup-token"
  key_vault_id = "${data.azurerm_key_vault.sscs_key_vault.id}"
}

locals {
  aseName = "core-compute-${var.env}"

  vaultName = "${var.product}-${var.env}"

  ApiUrl = "http://sscs-tribunals-api-${var.env}.service.${local.aseName}.internal"

  shared_app_service_plan     = "${var.product}-${var.env}"
  non_shared_app_service_plan = "${var.product}-${var.component}-${var.env}"
  app_service_plan            = "${var.env == "sandbox" ? local.shared_app_service_plan : local.non_shared_app_service_plan}"

}

module "submit-your-appeal-frontend" {
  source                          = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product                         = "${var.product}-${var.component}"
  location                        = "${var.location}"
  env                             = "${var.env}"
  ilbIp                           = "${var.ilbIp}"
  is_frontend                     = 1
  subscription                    = "${var.subscription}"
  additional_host_name            = "${var.sya_hostname}"
  https_only                      = "false"
  common_tags                     = "${var.common_tags}"
  asp_rg                          = "${local.app_service_plan}"
  asp_name                        = "${local.app_service_plan}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"


  app_settings = {
    TRIBUNALS_CASE_API_URL        = "${local.ApiUrl}"
    REDIS_URL                     = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    SESSION_SECRET                = "${module.redis-cache.access_key}"
    NODE_ENV                      = "${var.node_environment}"
    WEBSITE_NODE_DEFAULT_VERSION  = "12.13.0"
    UPLOAD_EVIDENCE_URL           = "${local.ApiUrl}/evidence/upload"
    POSTCODE_CHECKER_ALLOWED_RPCS = "birmingham,liverpool,sutton,leeds,newcastle,cardiff,glasgow"
    POSTCODE_LOOKUP_TOKEN         = "${data.azurerm_key_vault_secret.postcode_lookup_token.value}"

    SERVICES_IDAM_SECRET        = "${data.azurerm_key_vault_secret.idam_oauth2_client_secret.value}"
    SERVICES_IDAM_LOGIN_URL     = "${var.idam_login_url}"
    SERVICES_IDAM_API_URL       = "${var.idam_api_url}"
    SERVICES_WEB_FORM           = "${var.services_web_form}"
    CONTACT_US_WEB_FORM_ENABLED = "${var.contact_us_web_form_enabled}"
    SERVICES_WEBCHAT_UUID       = "${var.services_webchat_uuid}"
    SERVICES_WEBCHAT_TENANT     = "${var.services_webchat_tenant}"
    SERVICES_WEBCHAT_CHANNEL    = "${var.services_webchat_channel}"
    SERVICES_BTN_NO_AGENTS      = "${var.services_btn_no_agents}"
    SERVICES_BTN_AGENTS_BUSY    = "${var.services_btn_agents_busy}"
    SERVICES_BTN_SERVICE_CLOSED = "${var.services_btn_service_closed}"

    // Disable dynamic cache to prevent MS bug that makes dynamically generated assets to disappear.
    WEBSITE_LOCAL_CACHE_OPTION   = "Never"
    WEBSITE_LOCAL_CACHE_SIZEINMB = 0
    WEBSITE_DYNAMIC_CACHE        = 0
  }
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

module "redis-cache" {
  source      = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product     = "${var.product}-redis"
  location    = "${var.location}"
  env         = "${var.env}"
  subnetid    = "${data.azurerm_subnet.core_infra_redis_subnet.id}"
  common_tags = "${var.common_tags}"
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.product}-redis-access-key"
  value        = "${module.redis-cache.access_key}"
  key_vault_id = "${data.azurerm_key_vault.sscs_key_vault.id}"
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name         = "${var.product}-redis-connection-string"
  value        = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
  key_vault_id = "${data.azurerm_key_vault.sscs_key_vault.id}"
}