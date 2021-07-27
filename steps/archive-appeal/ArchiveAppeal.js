const paths = require('paths');
const { archiveDraftById, LoadJourneyAndRedirect } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');

let multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';


class ArchiveAppeal extends LoadJourneyAndRedirect {
  static get path() {
    return paths.archiveDraft;
  }

  // eslint-disable-next-line no-unused-vars
  async handler(req, res, next) {
    const caseId = req.query.caseId;

    if (multipleDraftsEnabled &&
      req.method === 'GET' &&
      caseId &&
      req.session.drafts &&
      req.session.drafts[caseId]) {
      if (req.session.ccdCaseId === caseId) {
        await archiveDraftById(req, res, next, caseId);
        res.redirect(paths.drafts);
      } else {
        const draft = req.session.drafts[caseId];
        draft.isUserSessionRestored = true;
        draft.entryPoint = 'Entry';
        Object.assign(req.session, draft);
        res.redirect(`${paths.archiveDraft}/?caseId=${caseId}`);
      }
    } else {
      res.redirect(this.journey.steps.BenefitType);
    }
  }

  next() {
    return goTo(paths.start.benefitType);
  }

  setMultiDraftsEnabled(value) {
    multipleDraftsEnabled = value;
  }
}

module.exports = ArchiveAppeal;
