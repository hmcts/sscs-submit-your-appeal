const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('services/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const logger = require('logger');
logger.monitoringMiddleware({
  connectionString: config.get('appInsights.connectionString'),
  serviceName: config.get('appInsights.roleName'),
  enabled: config.get('appInsights.enabled')
});

const s2s = require('services/s2s');
s2s.initTokenRefresh();

const app = require('app.js');
const https = require('https');

const fs = require('graceful-fs');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.config.js');
const webpackMiddleware = require('webpack-dev-middleware');
const { fetchAndSetPortsAndCountries } = require('./utils/enumJsonLists');

const logPath = 'server.js';

(async function initialiseEnums() {
  await fetchAndSetPortsAndCountries();
  setInterval(async() => {
    await fetchAndSetPortsAndCountries();
    /* eslint-disable-next-line no-magic-numbers */
  }, 60 * 60 * 1000);
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