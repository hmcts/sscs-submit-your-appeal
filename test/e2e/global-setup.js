const fileAcceptor = require('test/file_acceptor');

module.exports = () => {
  setTimeout(() => {
    console.log('Waiting for the server to start');
  }, 5000);
  fileAcceptor.bootstrap();
};
