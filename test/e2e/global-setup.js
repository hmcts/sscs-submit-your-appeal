const fileAcceptor = require('test/file_acceptor');
const { generateToken } = require('test/util/s2s');

module.exports = async() => {
  fileAcceptor.bootstrap();
  await generateToken();
};
