const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class PrivacyPolicy extends Question {
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
