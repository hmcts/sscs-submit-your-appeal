#!/bin/sh

# Set environment variable from Azure secret vault
# Parameters: <Environment variable name> <Vault Name> <Secret Name>
loadSecret () {
  export "$1"="$(az keyvault secret show --name "$3" --vault-name $2 --query "value" | sed -e 's/^"//' -e 's/"$//')"
  echo $1
}

echo "Fetching secrets..."

loadSecret "SERVER_KEY" "sscs-aat" "server-key"
loadSecret "SERVER_CERTIFICATE" "sscs-aat" "server-certificate"


echo "Secret fetching complete"
