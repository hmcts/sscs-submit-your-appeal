const logger = require('logger');
const { bootstrap } = require('../../test/file_acceptor');

bootstrap(() => logger.info('Started file acceptor', __filename));