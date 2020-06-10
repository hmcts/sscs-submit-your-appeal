const { goTo } = require('@hmcts/one-per-page');
const { RestoreFromDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Entry extends RestoreFromDraftStore {
  static get path() {
    return paths.session.entry;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  handler(req, res, next) {
    this.ft_welsh = req.session.featureToggles.ft_welsh;

    if (req.session.isUserSessionRestored) {
      res.redirect(paths.checkYourAppeal);
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    if (this.ft_welsh) {
      return goTo(this.journey.steps.LanguagePreference);
    }

    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = Entry;
