const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class TermsAndConditions extends Question {
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
