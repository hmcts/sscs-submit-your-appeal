const paths = require('paths');
const { Redirect } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');

class NewAppeal extends Redirect {
  static get path() {
    return paths.newAppeal;
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
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
