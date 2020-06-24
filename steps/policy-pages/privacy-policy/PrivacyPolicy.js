const { shimSessionStaticPage } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class PrivacyPolicy extends shimSessionStaticPage {
  static get path() {
    return paths.policy.privacy;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = PrivacyPolicy;
