/* eslint-disable no-process-env */
const testUser = require('../util/IdamUser');
const fileAcceptor = require('test/file_acceptor');

module.exports = () => {
  setTimeout(() => {
    console.log('Waiting for the server to start');
  }, 5000);
  fileAcceptor.bootstrap();
  process.env.USEREMAIL_1 = testUser.createUser();
};
