const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class Accessibility extends Page {
  static get path() {
    return paths.policy.accessibility;
  }
}

module.exports = Accessibility;
