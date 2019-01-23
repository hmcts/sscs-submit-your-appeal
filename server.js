const logger = require('logger');
const app = require('app.js');
const config = require('config');

app.listen(config.node.port);

const logPath = 'server.js';

logger.info(`SYA server listening on port: ${config.node.port}`, logPath);
