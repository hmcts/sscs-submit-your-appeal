const { goTo } = require('@hmcts/one-per-page');
const { RestoreFromDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');
const logger = require('logger');
const benefitTypes = require('../start/benefit-type/types');
const { isIba } = require('utils/benefitTypeUtils');

class Entry extends RestoreFromDraftStore {
  static get path() {
    return paths.session.entry;
  }

  handler(req, res, next) {
    logger.trace('Reached the entry endpoint');
    if (req.session.isUserSessionRestored) {
      res.redirect(paths.drafts);
    } else if (isIba(req)) {
      req.session.BenefitType = { benefitType: benefitTypes.infectedBloodAppeal };
      super.handler(req, res, next);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = Entry;
