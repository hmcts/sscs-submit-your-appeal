const { Interstitial } = require('lib/vendor/one-per-page/steps');
const { goTo } = require('lib/vendor/one-per-page/flow');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');

class StillCanAppeal extends Interstitial {
  static get path() {
    return paths.compliance.stillCanAppeal;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = StillCanAppeal;
