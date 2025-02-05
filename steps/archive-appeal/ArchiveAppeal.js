const paths = require('paths');
const {
  archiveDraft,
  LoadJourneyAndRedirect
} = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');

class ArchiveAppeal extends LoadJourneyAndRedirect {
  static get path() {
    return paths.archiveDraft;
  }

  // eslint-disable-next-line no-unused-vars
  async handler(req, res, next) {
    const caseId = req.query.caseId;

    if (
      req.method === 'GET' &&
      caseId &&
      req.session.drafts &&
      req.session.drafts[caseId]
    ) {
      if (req.session.ccdCaseId === caseId) {
        await archiveDraft(req, caseId);
        res.redirect(paths.drafts);
      } else {
        const draft = req.session.drafts[caseId];
        draft.isUserSessionRestored = true;
        draft.entryPoint = 'Entry';
        Object.assign(req.session, draft);
        res.redirect(`${paths.archiveDraft}/?caseId=${caseId}`);
      }
    } else {
      res.redirect(paths.start.benefitType);
    }
  }

  next() {
    return goTo(paths.start.benefitType);
  }
}

module.exports = ArchiveAppeal;
