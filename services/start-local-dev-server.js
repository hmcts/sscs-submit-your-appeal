const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const webpack = require('webpack');
const webpackDevConfig = require('../webpack/webpack.dev');
const webpackMiddleware = require('webpack-dev-middleware');
const app = require('../app');
const https = require('https');
const logger = require('../logger');

const logPath = 'start-local-dev-server.js';

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

const startLocalDevServer = async port => {
  const compiler = webpack(webpackDevConfig);
  const wp = webpackMiddleware(compiler, { publicPath: webpackDevConfig.output.publicPath });
  app.use(wp);
  const serverKey = await fetchSecret('server-key');
  const serverCertificate = await fetchSecret('server-certificate');
  wp.waitUntilValid(stats => {
    app.locals.webpackHash = stats.hash;
    https.createServer({
      key: serverKey,
      cert: serverCertificate
    }, app).listen(port, () => {
      logger.trace(`SYA server listening on port: ${port}`, logPath);
    });
  });
};

module.exports = startLocalDevServer;
