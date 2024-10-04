const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const { isIba } = require('../../../utils/benefitTypeUtils');


class IbaOverview extends Interstitial {
  static get path() {
    return paths.start.ibaOverview;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.IbaStartPage);
  }
}

module.exports = IbaOverview;
