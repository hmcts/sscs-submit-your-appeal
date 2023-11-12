const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('services/setupSecrets');
const startLocalDevServer = require('services/start-local-dev-server');

// Setup secrets before loading the app
setupSecrets();

const app = require('app.js');
const logger = require('logger');

const logPath = 'server.js';

if (process.env.NODE_ENV === 'development') {
  startLocalDevServer()
    .then(() => logger.trace('SYA local development server started'));
} else {
  app
    .listen(config.node.port,
      () => logger.trace(`SYA server listening on port: ${config.node.port}`, logPath));
}
app.timeout = 240000;
