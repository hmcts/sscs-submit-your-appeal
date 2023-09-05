const path = require('path');
const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const fs = require('fs').promises;

async function mount(vaultName, nameSpace, outputDir, secret) {
  try {
    const credential = new AzureCliCredential();
    const vaultUrl = `https://${vaultName}.vault.azure.net/`;
    const client = new SecretClient(vaultUrl, credential);

    fs.mkdir(path.join(outputDir, nameSpace), { recursive: true }, error => {
      if (error) {
        console.log(error);
      } else {
        console.log('Directory created');
      }
    });

    const secretValue = await client.getSecret(secret);
    const filePath = outputDir ? path.join(outputDir, nameSpace, secret) : secret;

    let secretOutput = secretValue.value;
    let secretPrefix = '';
    let secretSuffix = '';
    if (secret === 'server-key') {
      secretPrefix = '-----BEGIN PRIVATE KEY-----';
      secretSuffix = '-----END PRIVATE KEY-----';
    } else if (secret === 'server-certificate') {
      secretPrefix = '-----BEGIN CERTIFICATE-----';
      secretSuffix = '-----END CERTIFICATE-----';
    }

    secretOutput = secretOutput.replace(secretPrefix, `${secretPrefix}\n`).replace(secretSuffix, `\n${secretSuffix}`);

    await fs.writeFile(filePath, secretOutput);
    console.log(`Secret '${secret}' stored in '${filePath}'`);
  } catch (error) {
    if (error.name === 'CredentialUnavailableError') {
      throw new Error("Azure CLI credential is not available. Please log in using 'az login'.");
    } else {
      throw new Error(error);
    }
  }
}

async function run() {
  await mount('sscs-aat', 'sscs-aat', './secrets', 'server-key');
  await mount('sscs-aat', 'sscs-aat', './secrets', 'server-certificate');
}

module.exports = run;
