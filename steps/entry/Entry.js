const { goTo } = require('@hmcts/one-per-page');
const { RestoreFromDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');

class Entry extends RestoreFromDraftStore {
  static get path() {
    return paths.session.entry;
  }

  handler(req, res, next) {
    if (req.session.isUserSessionRestored) {
      res.redirect(paths.checkYourAppeal);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = Entry;
