const app = require('./app.js');
const logger = require('logger');
const config = require('config');
const https = require('https');
const fs = require('graceful-fs');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.js');
const webpackMiddleware = require('webpack-dev-middleware');

const logPath = 'server.js';

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  const wp = webpackMiddleware(compiler, { publicPath: webpackConfig.output.publicPath });
  app.use(wp);

  wp.waitUntilValid(() => {
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
