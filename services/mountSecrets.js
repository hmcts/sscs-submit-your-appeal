const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

async function mount(vaultName, secret) {
  try {
    const credential = new AzureCliCredential();
    const vaultUrl = `https://${vaultName}.vault.azure.net/`;
    const client = new SecretClient(vaultUrl, credential);
    const secretValue = await client.getSecret(secret);
    let secretPrefix = '';
    let secretSuffix = '';

    if (secret === 'server-key') {
      secretPrefix = '-----BEGIN PRIVATE KEY-----';
      secretSuffix = '-----END PRIVATE KEY-----';
    } else if (secret === 'server-certificate') {
      secretPrefix = '-----BEGIN CERTIFICATE-----';
      secretSuffix = '-----END CERTIFICATE-----';
    }

    return secretValue.value.replace(secretPrefix, `${secretPrefix}\n`).replace(secretSuffix, `\n${secretSuffix}`);
  } catch (error) {
    if (error.name === 'CredentialUnavailableError') {
      throw new Error("Azure CLI credential is not available. Please log in using 'az login'.");
    } else {
      throw new Error(error);
    }
  }
}

async function run() {
  const serverKey = await mount('sscs-aat', 'server-key');
  const serverCertificate = await mount('sscs-aat', 'server-certificate');
  return {serverKey, serverCertificate}
}

module.exports = run;
