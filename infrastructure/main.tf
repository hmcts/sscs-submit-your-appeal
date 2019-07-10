data "azurerm_key_vault" "sscs_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "hpkp-sya-sha-1" {
  name = "hpkp-sya-sha-1"
  vault_uri = "${data.azurerm_key_vault.sscs_key_vault.vault_uri}"
}
data "azurerm_key_vault_secret" "hpkp-sya-sha-2" {
  name = "hpkp-sya-sha-2"
  vault_uri = "${data.azurerm_key_vault.sscs_key_vault.vault_uri}"
}
data "azurerm_key_vault_secret" "idam_oauth2_client_secret" {
  name      = "idam-sscs-oauth2-client-secret"
  vault_uri = "${data.azurerm_key_vault.sscs_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "postcode_lookup_token" {
  name      = "postcode-lookup-token"
  vault_uri = "${data.azurerm_key_vault.sscs_key_vault.vault_uri}"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  vaultName = "${var.raw_product}-${var.env}"

  ApiUrl      = "http://sscs-tribunals-api-${var.env}.service.${local.aseName}.internal"

  shared_app_service_plan     = "${var.product}-${var.env}"
  non_shared_app_service_plan = "${var.product}-${var.component}-${var.env}"
  app_service_plan            = "${(var.env == "saat" || var.env == "sandbox") ? local.shared_app_service_plan : local.non_shared_app_service_plan}"

}

module "submit-your-appeal-frontend" {
  source               = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product              = "${var.product}-${var.component}"
  location             = "${var.location}"
  env                  = "${var.env}"
  ilbIp                = "${var.ilbIp}"
  is_frontend          = 1
  subscription         = "${var.subscription}"
  additional_host_name = "${var.sya_hostname}"
  https_only           = "${var.https_only_flag}"
  common_tags          = "${var.common_tags}"
  asp_rg               = "${local.app_service_plan}"
  asp_name             = "${local.app_service_plan}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"


  app_settings = {
    TRIBUNALS_CASE_API_URL        = "${local.ApiUrl}"
    REDIS_URL                     = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    SESSION_SECRET                = "${module.redis-cache.access_key}"
    NODE_ENV                      = "${var.node_environment}"
    HTTP_PROTOCOL                 = "https"
    WEBSITE_NODE_DEFAULT_VERSION  = "8.11.1"
    HPKP_SHA256                   = "${data.azurerm_key_vault_secret.hpkp-sya-sha-1.value}"
    HPKP_SHA256_BACKUP            = "${data.azurerm_key_vault_secret.hpkp-sya-sha-2.value}"
    EVIDENCE_UPLOAD_ENABLED       = "${var.evidence_upload_enabled}"
    UPLOAD_EVIDENCE_URL           = "${local.ApiUrl}/evidence/upload"
    POSTCODE_CHECKER_URL          = "${local.ApiUrl}/regionalcentre"
    POSTCODE_CHECKER_ENABLED      = "${var.postcode_checker_enabled}"
    POSTCODE_CHECKER_ALLOWED_RPCS = "${var.postcode_checker_allowed_rpcs}"
    POSTCODE_LOOKUP_ENABLED       = "${var.postcode_lookup_enabled}"
    POSTCODE_LOOKUP_TOKEN         = "${data.azurerm_key_vault_secret.postcode_lookup_token.value}"

    ALLOW_SAVE_RETURN             = "${var.allow_save_return}"
    SERVICES_IDAM_SECRET          = "${data.azurerm_key_vault_secret.idam_oauth2_client_secret.value}"
    SERVICES_IDAM_LOGIN_URL       = "${var.idam_login_url}"
    SERVICES_IDAM_API_URL         = "${var.idam_api_url}"
    SERVICES_WEB_FORM             = "${var.services_web_form}"
    CONTACT_US_WEB_FORM_ENABLED   = "${var.contact_us_web_form_enabled}"
    SERVICES_WEBCHAT_UUID         = "${var.services_webchat_uuid}"
    SERVICES_WEBCHAT_TENANT       = "${var.services_webchat_tenant}"
    SERVICES_WEBCHAT_CHANNEL      = "${var.services_webchat_channel}"
    ALLOW_CONTACT_US              = "${var.allow_contact_us}"
    CONTACT_US_TELEPHONE_ENABLED  = "${var.contact_us_telephone_enabled}"
    CONTACT_US_WEBCHAT_ENABLED    = "${var.contact_us_webchat_enabled}"
    // Disable dynamic cache to prevent MS bug that makes dynamically generated assets to disappear.
    WEBSITE_LOCAL_CACHE_OPTION    = "Never"
    WEBSITE_LOCAL_CACHE_SIZEINMB  = 0
    WEBSITE_DYNAMIC_CACHE         = 0
  }
}

module "redis-cache" {
  source      = "git@github.com:contino/moj-module-redis?ref=master"
  product     = "${var.product}-redis"
  location    = "${var.location}"
  env         = "${var.env}"
  subnetid    = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
  common_tags = "${var.common_tags}"
}
