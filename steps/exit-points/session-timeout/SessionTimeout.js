const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class SessionTimeout extends ExitPoint {
  static get path() {
    return paths.session.timeout;
  }
}

module.exports = SessionTimeout;
