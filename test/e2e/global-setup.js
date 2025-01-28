/* eslint-disable no-process-env */
const testUser = require('../util/IdamUser');
const fileAcceptor = require('test/file_acceptor');

module.exports = () => {
  fileAcceptor.bootstrap();
  process.env.USEREMAIL_1 = testUser.createUser();
};
