const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Exit extends ExitPoint {
  static get path() {
    return paths.session.exit;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = Exit;
