const { Logger } = require('@hmcts/nodejs-logging');
const { bootstrap } = require('../../test/file_acceptor');

const logger = Logger.getLogger('evidence_uploader.js');

bootstrap(() => logger.log('Started file acceptor'));