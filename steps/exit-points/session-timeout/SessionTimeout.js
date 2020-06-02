const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class SessionTimeout extends ExitPoint {
  static get path() {
    return paths.session.timeout;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = SessionTimeout;
