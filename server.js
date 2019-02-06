const appInsights = require('applicationinsights');
const logger = require('logger');
const app = require('app.js');
const config = require('config');

const logPath = 'server.js';
const env = process.env.NODE_ENV || 'development';
const roleName = 'sya';

app.listen(config.node.port);

logger.trace(`NODE_ENV is ${env}`, logPath);

if (env !== 'development') {
  logger.trace(`appInsights role name is ${roleName}`, logPath);
  appInsights.setup();
  const client = appInsights.defaultClient;
  client.context.tags[appInsights.defaultClient.context.keys.cloudRole] = roleName;
}

logger.trace(`SYA server listening on port: ${config.node.port}`, logPath);