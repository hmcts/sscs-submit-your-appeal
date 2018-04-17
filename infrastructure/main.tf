provider "vault" {
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "hpkp_sya_sha_1" {
  path = "secret/${var.infrastructure_env}/sscs/hpkp_sya_sha_1"
}

data "vault_generic_secret" "hpkp_sya_sha_2" {
  path = "secret/${var.infrastructure_env}/sscs/hpkp_sya_sha_2"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  localApiUrl = "http://sscs-tribunals-api-${var.env}.service.${local.aseName}.internal"
  ApiUrl = "${var.env == "preview" ? "http://sscs-tribunals-api-aat.service.core-compute-aat.internal" : local.localApiUrl}"
}

module "submit-your-appeal-frontend" {
  source               = "git@github.com:contino/moj-module-webapp?ref=master"
  product              = "${var.product}-${var.component}"
  location             = "${var.location}"
  env                  = "${var.env}"
  ilbIp                = "${var.ilbIp}"
  is_frontend          = true
  subscription         = "${var.subscription}"
  additional_host_name = "${var.sya_hostname}"
  https_only           = "true"


  app_settings = {
    TRIBUNALS_CASE_API_URL       = "${local.ApiUrl}"
    REDIS_URL                    = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    SESSION_SECRET               = "${module.redis-cache.access_key}"
    NODE_ENV                     = "${var.node_environment}"
    HTTP_PROTOCOL                = "https"
    WEBSITE_NODE_DEFAULT_VERSION = "8.9.3"
    EXTERNAL_HOSTNAME            = "${var.sya_hostname}"
    HPKP_SHA256                  = "${data.vault_generic_secret.hpkp_sya_sha_1.data["value"]}"
    HPKP_SHA256_BACKUP           = "${data.vault_generic_secret.hpkp_sya_sha_2.data["value"]}"
  }
}

module "redis-cache" {
  source   = "git@github.com:contino/moj-module-redis?ref=master"
  product  = "${var.product}-redis"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
}

