const { shimSessionInterstitial } = require('middleware/shimSession');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class StillCanAppeal extends shimSessionInterstitial {
  static get path() {
    return paths.compliance.stillCanAppeal;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = StillCanAppeal;
