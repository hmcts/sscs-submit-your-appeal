module "submit-your-appeal-frontend" {
  source   = "git@github.com:contino/moj-module-webapp?ref=master"
  product  = "${var.product}-frontend"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"

  app_settings = {
    TRIBUNALS_CASE_API_URL       = "http://sscs-tribunals-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
    REDIS_URL                    = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
    SESSION_SECRET               = "${module.redis-cache.access_key}"
    WEBSITE_NODE_DEFAULT_VERSION = "8.8.1"
    NODE_ENV                     = "${var.node_environment}"
    HTTP_PROTOCOL                = "https"
    PORT                         = "${var.sya_server_port}"
    WEBSITE_NODE_DEFAULT_VERSION = "8.9.0"
  }
}


module "redis-cache" {
  source   = "git@github.com:contino/moj-module-redis?ref=master"
  product  = "${var.product}-redis"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[1]}"
}

