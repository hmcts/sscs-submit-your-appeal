const { ExitPoint } = require('lib/vendor/one-per-page');
const paths = require('paths');

class SessionTimeout extends ExitPoint {
  static get path() {
    return paths.session.timeout;
  }
}

module.exports = SessionTimeout;
