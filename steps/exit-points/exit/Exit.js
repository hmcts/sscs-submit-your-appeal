const { shimSessionExitPoint } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Exit extends shimSessionExitPoint {
  static get path() {
    return paths.session.exit;
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }
}

module.exports = Exit;
