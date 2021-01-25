const paths = require('paths');
const { RestoreAllDraftsState } = require('middleware/draftAppealStoreMiddleware');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');

let multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

class DraftAppeals extends RestoreAllDraftsState {
  static get path() {
    return paths.drafts;
  }

  handler(req, res, next) {
    if (multipleDraftsEnabled && req.method === 'GET') {
      resetJourney(req);
      super.handler(req, res, next);
    } else {
      res.redirect(this.journey.steps.BenefitType);
    }
  }

  next() {
    return redirectTo(this.journey.steps.BenefitType);
  }

  get drafts() {
    const draftCases = this.req.session.drafts;
    return draftCases;
  }

  appellantName(draft) {
    if (draft.AppellantName && draft.AppellantName.firstName && draft.AppellantName.lastName) {
      return `${draft.AppellantName.firstName} ${draft.AppellantName.lastName}`;
    }
    return 'Appellant Name Not Set';
  }

  benefit(draft) {
    if (draft.BenefitType && draft.BenefitType.benefitType) {
      return draft.BenefitType.benefitType;
    }
    return 'Benefit Not Set';
  }

  mrnDate(draft) {
    if (draft.HaveAMRN && draft.HaveAMRN.haveAMRN === 'yes' && draft.MRNDate) {
      const mrnDateObj = draft.MRNDate.mrnDate;
      const mrnDate = moment(`${mrnDateObj.day}-${mrnDateObj.month}-${mrnDateObj.year}`, 'DD-MM-yyyy');
      return DateUtils.formatDate(mrnDate, 'DD MMM YYYY');
    }
    return 'No Mrn';
  }

  setMultiDraftsEnabled(value) {
    multipleDraftsEnabled = value;
  }
}

module.exports = DraftAppeals;
