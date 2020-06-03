const { shimSessionExitPoint } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Exit extends shimSessionExitPoint {
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
