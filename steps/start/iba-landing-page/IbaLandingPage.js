const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const config = require('config');
const { isIba } = require('../../../utils/benefitTypeUtils');


class IbaLandingPage extends Interstitial {
  static get path() {
    return paths.start.ibaLandingPage;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    const isWelshEnabled = () => process.env.FT_WELSH === 'true' || config.features.welsh.enabled === 'true';
    return branch(
      goTo(this.journey.steps.LanguagePreference).if(isWelshEnabled),
      goTo(this.journey.steps.Independence)
    );
  }
}

module.exports = IbaLandingPage;
