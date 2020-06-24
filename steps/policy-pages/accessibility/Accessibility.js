const { shimSessionStaticPage } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Accessibility extends shimSessionStaticPage {
  static get path() {
    return paths.policy.accessibility;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = Accessibility;
