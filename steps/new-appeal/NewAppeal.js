const paths = require('paths');
const { Redirect } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');

const multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

class NewAppeal extends Redirect {
  static get path() {
    return paths.newAppeal;
  }

  handler(req, res, next) {
    if (multipleDraftsEnabled && req.method === 'GET') {
      resetJourney(req);
      res.redirect(paths.start.benefitType);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = NewAppeal;
