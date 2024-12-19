const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class RequestIbcAppealForm extends Page {
  static get path() {
    return paths.policy.requestIbcAppealForm;
  }
}

module.exports = RequestIbcAppealForm;
