const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class TermsAndConditions extends Page {
  static get path() {
    return paths.policy.termsAndConditions;
  }
}

module.exports = TermsAndConditions;
