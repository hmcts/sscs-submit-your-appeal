const { shimSessionExitPoint } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class CantAppeal extends shimSessionExitPoint {
  static get path() {
    return paths.compliance.cantAppeal;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = CantAppeal;
