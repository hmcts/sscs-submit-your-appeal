const logger = require('logger');
const { bootstrap } = require('../../test/file_acceptor');

bootstrap(() => logger.trace('Started file acceptor', __filename));