terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.45.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}
