const { Logger } = require('@hmcts/nodejs-logging');
const app = require('app.js');
const config = require('config');

const logger = Logger.getLogger('server.js');

app.listen(config.node.port);
logger.info(`SYA server listening on port: ${config.node.port}`);
