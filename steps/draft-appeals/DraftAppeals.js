const paths = require('paths');
const { RestoreAllDraftsState } = require('middleware/draftAppealStoreMiddleware');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const { goTo } = require('@hmcts/one-per-page/flow');

class DraftAppeals extends RestoreAllDraftsState {
  static get path() {
    return paths.drafts;
  }

  handler(req, res, next) {
    console.log('drafts handler');
    super.handler(req, res, next);
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }

  get drafts() {
    const draftCases = this.req.session.drafts;
    return draftCases;
  }

  appellantName(draft) {
    if (draft.AppellantName && draft.AppellantName.firstName && draft.AppellantName.lastName) {
      return `${draft.AppellantName.firstName} ${draft.AppellantName.lastName}`;
    } else {
      return 'Appellant Name Not Set';
    }
  }

  benefit(draft) {
    if(draft.BenefitType && draft.BenefitType.benefitType) {
      return draft.BenefitType.benefitType;
    } else {
      return 'Benefit Not Set';
    }
  }

  mrnDate(draft) {
    if (draft.HaveAMRN && draft.HaveAMRN.haveAMRN === 'yes' && draft.MRNDate) {
      const mrnDateObj = draft.MRNDate.mrnDate;
      const mrnDate = moment(`${mrnDateObj.day}, ${mrnDateObj.month}, ${mrnDateObj.year}`, 'dd,mm,yyyy');
      return DateUtils.formatDate(mrnDate, 'DD MMMM YYYY');
    }
    return 'No Mrn';
  }
}

module.exports = DraftAppeals;
