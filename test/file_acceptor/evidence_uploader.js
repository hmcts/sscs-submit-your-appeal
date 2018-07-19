const { Logger } = require('@hmcts/nodejs-logging');
const { bootstrap } = require('test/file_acceptor');

bootstrap(() => Logger.log('Started file acceptor'));