const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const app = require('../app');
const config = require('config');
const https = require('https');
const logger = require('../logger');
const webpack = require('webpack');
const webpackDevConfig = require('../webpack/webpack.dev');
const webpackMiddleware = require('webpack-dev-middleware');

async function mount(vaultName, secret) {
  try {
    const credential = new AzureCliCredential();
    const vaultUrl = `https://${vaultName}.vault.azure.net/`;
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

async function fetchSecrets() {
  const serverKey = await mount('sscs-aat', 'server-key');
  const serverCertificate = await mount('sscs-aat', 'server-certificate');
  return { serverKey, serverCertificate };
}

const startLocalDevServer = async() => {
  const compiler = webpack(webpackDevConfig);
  const wp = webpackMiddleware(compiler, { publicPath: webpackDevConfig.output.publicPath });
  app.use(wp);
  const { serverKey, serverCertificate } = await fetchSecrets();
  wp.waitUntilValid(stats => {
    app.locals.webpackHash = stats.hash;
    https.createServer({
      key: serverKey,
      cert: serverCertificate
    }, app).listen(config.node.port, () => {
      logger.trace(`SYA server listening on port: ${config.node.port}`);
    });
  });
};

module.exports = startLocalDevServer;
