const paths = require('paths');
const { Redirect } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');

let multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

class EditAppeal extends Redirect {
  static get path() {
    return paths.editDraft;
  }

  // eslint-disable-next-line no-unused-vars
  handler(req, res, next) {
    if (multipleDraftsEnabled && req.method === 'GET') {
      const caseId = req.query.caseId;

      if (req.query.caseId && req.session.drafts && req.session.drafts[caseId]) {
        resetJourney(req);
        const draft = req.session.drafts[caseId];
        draft.isUserSessionRestored = true;
        draft.entryPoint = 'Entry';
        Object.assign(req.session, draft);
        res.redirect(paths.checkYourAppeal);
      } else {
        res.redirect(paths.session.entry);
      }
    } else {
      res.redirect(this.journey.steps.BenefitType);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }

  setMultiDraftsEnabled(value) {
    multipleDraftsEnabled = value;
  }
}

module.exports = EditAppeal;
