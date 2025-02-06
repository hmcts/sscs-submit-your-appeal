terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.15.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}
