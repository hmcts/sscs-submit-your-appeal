const fileAcceptor = require('test/file_acceptor');
const logger = require('logger');

const logPath = 'saucelabs.conf.js';

module.exports = async() => {
  logger.trace('Wait for 30 seconds before Jenkins queries SauceLabs results...', logPath);
  await new Promise(resolve => setTimeout(resolve, 30000));
  fileAcceptor.teardown();
};
