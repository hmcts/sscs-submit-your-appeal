const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

async function fetchSecret(secret) {
  try {
    const credential = new AzureCliCredential();
    const vaultUrl = 'https://sscs-aat.vault.azure.net/';
    const client = new SecretClient(vaultUrl, credential);
    const secretValue = await client.getSecret(secret);
    const prefix = secretValue.value.match(/-----BEGIN (PRIVATE KEY|CERTIFICATE)-----/gm)[0];
    const suffix = secretValue.value.match(/-----END (PRIVATE KEY|CERTIFICATE)-----/gm)[0];

    return secretValue.value.replace(prefix, `${prefix}\n`).replace(suffix, `\n${suffix}`);
  } catch (error) {
    if (error.name === 'CredentialUnavailableError') {
      throw new Error("Azure CLI credential is not available. Please log in using 'az login'.");
    } else {
      throw new Error(error);
    }
  }
}

async function run() {
  const serverKey = await fetchSecret('server-key');
  const serverCertificate = await fetchSecret('server-certificate');
  return { serverKey, serverCertificate };
}

module.exports = run;
