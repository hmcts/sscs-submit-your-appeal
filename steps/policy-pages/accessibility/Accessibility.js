const { Page } = require('lib/vendor/one-per-page');
const paths = require('paths');
const { isIba } = require('../../../utils/benefitTypeUtils');

class Accessibility extends Page {
  static get path() {
    return paths.policy.accessibility;
  }

  get suffix() {
    return isIba(this.req) ? 'Iba' : '';
  }
}

module.exports = Accessibility;
