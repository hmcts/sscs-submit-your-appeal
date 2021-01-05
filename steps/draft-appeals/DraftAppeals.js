const paths = require('paths');
const { Page } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const { goTo } = require('@hmcts/one-per-page/flow');

class DraftAppeals extends Page {
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

    console.log(draftCases);

    return draftCases;
  }

  appellantName(draft) {
    return `${draft.AppellantName.firstName} ${draft.AppellantName.lastName}`;
  }

  benefit(draft) {
    return draft.BenefitType.benefitType;
  }

  mrnDate(draft) {
    if (draft.HaveAMRN.haveAMRN === 'yes' && draft.MRNDate) {
      const mrnDateObj = draft.MRNDate.mrnDate;
      const mrnDate = moment(`${mrnDateObj.day}, ${mrnDateObj.month}, ${mrnDateObj.year}`, 'dd,mm,yyyy');
      return DateUtils.formatDate(mrnDate, 'DD MMMM YYYY');
    }
    return 'No Mrn';
  }
}

module.exports = DraftAppeals;
