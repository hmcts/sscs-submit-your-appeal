#!/usr/bin/env bash

# Set environment variable from Azure secret vault
# Parameters: <Environment variable name> <Vault Name> <Secret Name>

echo "$(az keyvault secret show --name "postcode-lookup-token" --vault-name sscs-aat --query "value" | sed -e 's/^"//' -e 's/"$//')"