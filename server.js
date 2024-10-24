/* eslint-disable no-await-in-loop */
const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('services/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const app = require('app.js');
const logger = require('logger');
const https = require('https');

const fs = require('graceful-fs');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.config.js');
const webpackMiddleware = require('webpack-dev-middleware');
const { fetchPortsOfEntry, fetchCountriesOfResidence } = require('utils/enumJsonLists');
const { getPortsOfEntry, getCountriesOfResidence } = require('./utils/enumJsonLists');

const logPath = 'server.js';

(async function initialiseEnums() {
  const fetchLimit = 5;
  for (let i = 0; i < fetchLimit; i++) {
    await fetchPortsOfEntry();
    await fetchCountriesOfResidence();
    if (getPortsOfEntry().length > 0 && getCountriesOfResidence().length > 0) {
      break;
    }
  }
}());

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackDevConfig);
  const wp = webpackMiddleware(compiler, { publicPath: webpackDevConfig.output.publicPath });
  app.use(wp);

  wp.waitUntilValid(stats => {
    app.locals.webpackHash = stats.hash;
    https.createServer({
      key: fs.readFileSync('src/main/resources/localhost-ssl/localhost.key'), // eslint-disable-line
      cert: fs.readFileSync('src/main/resources/localhost-ssl/localhost.crt') // eslint-disable-line
    }, app).listen(config.node.port, () => {
      logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);
    });
  });
} else {
  app
    .listen(config.node.port,
      () => {
        logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);
      });
}

app.timeout = 240000;