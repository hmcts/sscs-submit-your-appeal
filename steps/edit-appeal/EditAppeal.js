const paths = require('paths');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');

class EditAppeal extends SaveToDraftStore {
  static get path() {
    return paths.editDraft;
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      const caseId = req.query.caseId;
      if (req.query.caseId && req.session.drafts && req.session.drafts[caseId]) {
        const draft = req.session.drafts[caseId];
        draft.isUserSessionRestored = true;
        draft.entryPoint = 'Entry';
        Object.assign(req.session, draft);
        res.redirect(paths.checkYourAppeal);
      } else {
        res.redirect(paths.session.entry);
      }
    } else {
      super.handler(req, res, next);
    }
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = EditAppeal;
