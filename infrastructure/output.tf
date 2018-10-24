output "vaultUri" {
  value = "${data.azurerm_key_vault.sscs_key_vault.vault_uri}"
}

output "vaultName" {
  value = "${local.vaultName}"
}

output "sscs-output" {
  value = "sscs-output"
}
