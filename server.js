const { Logger } = require('@hmcts/nodejs-logging');
const app = require('app.js');
const config = require('config');

const logger = Logger.getLogger('server.js');

const server = app.listen(config.node.port);
logger.info(`SYA server listening on port: ${server.address().port}`);
