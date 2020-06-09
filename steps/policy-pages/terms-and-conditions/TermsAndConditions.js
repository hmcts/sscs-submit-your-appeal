const { shimSessionStaticPage } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class TermsAndConditions extends shimSessionStaticPage {
  static get path() {
    return paths.policy.termsAndConditions;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = TermsAndConditions;
