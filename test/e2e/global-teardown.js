/* eslint-disable no-process-env */
const testUser = require('../util/IdamUser');
const fileAcceptor = require('test/file_acceptor');

module.exports = () => {
  fileAcceptor.teardown();
  testUser.deleteUser(process.env.USEREMAIL_1);
};
