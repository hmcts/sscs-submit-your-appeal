const paths = require('paths');
const { Redirect } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');
const { isIba } = require('utils/benefitTypeUtils');
const benefitTypes = require('../start/benefit-type/types');

class NewAppeal extends Redirect {
  static get path() {
    return paths.newAppeal;
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      const ibaCase = isIba(req);
      resetJourney(req);
      if (ibaCase) {
        req.session.BenefitType = {
          benefitType: benefitTypes.infectedBloodCompensation
        };
        super.handler(req, res, next);
      } else {
        res.redirect(paths.start.benefitType);
      }
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = NewAppeal;
