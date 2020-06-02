const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class CantAppeal extends ExitPoint {
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
