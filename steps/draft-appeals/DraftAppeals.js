const paths = require('paths');
const { RestoreAllDraftsState } = require('middleware/draftAppealStoreMiddleware');
const { resetJourney } = require('middleware/draftAppealStoreMiddleware');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { isIba } = require('utils/benefitTypeUtils');
const benefitTypes = require('steps/start/benefit-type/types');

class DraftAppeals extends RestoreAllDraftsState {
  static get path() {
    return paths.drafts;
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      const ibaCase = isIba(req);
      resetJourney(req);
      if (ibaCase) req.session.BenefitType = { benefitType: benefitTypes.infectedBloodAppeal };
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
    const ibaCase = isIba(this.req);
    return Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(draftCases).filter(([key, caseData]) => {
        const { benefitType } = caseData.BenefitType || {};
        return ibaCase ?
          benefitType === benefitTypes.infectedBloodAppeal :
          benefitType !== benefitTypes.infectedBloodAppeal;
      })
    );
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
}

module.exports = DraftAppeals;
