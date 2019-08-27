const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');

class StillCanAppeal extends Interstitial {
  static get path() {
    return paths.compliance.stillCanAppeal;
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = StillCanAppeal;
