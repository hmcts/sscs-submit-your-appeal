const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('services/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const app = require('./app.js');
const logger = require('logger');
const https = require('https');

const fs = require('graceful-fs');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack/webpack.dev.js');
const webpackMiddleware = require('webpack-dev-middleware');

const logPath = 'server.js';

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackDevConfig);
  const wp = webpackMiddleware(compiler, { publicPath: webpackDevConfig.output.publicPath });
  app.use(wp);

  wp.waitUntilValid(stats => {
    app.locals.webpackHash = stats.hash;
    https.createServer({
      key: fs.readFileSync('keys/server.key'), // eslint-disable-line
      cert: fs.readFileSync('keys/server.cert') // eslint-disable-line
    }, app).listen(config.node.port, () => {
      logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);
    });
  });
} else {
  app.listen(config.node.port, () => {
    logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);
  });
}
