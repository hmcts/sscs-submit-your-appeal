const app = require('./app.js');
const logger = require('logger');
const config = require('config');
const https = require('https');
const fs = require('graceful-fs');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack/webpack.dev.js');
const webpackProdConfig = require('./webpack/webpack.prod.js');
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
  const compiler = webpack(webpackProdConfig);
  compiler.run((error, stats) => {
    if (error) {
      logger.trace.error(error);
    }
    if (stats) {
      const time = stats.endTime - stats.startTime;
      logger.trace(`Webpack build complete in ${time}ms. Hash ${stats.hash}`);
      app.locals.webpackHash = stats.hash;
      app.listen(config.node.port, () => {
        logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);
      });
    }
  });
}
