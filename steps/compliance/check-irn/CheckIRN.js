const { goTo, branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text, date, ref } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { getBenefitCode } = require('utils/stringUtils');
const i18next = require('i18next');

class CheckIRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.checkIRNDate;
  }

  get benefitType() {
    return getBenefitCode(this.journey.req.session.BenefitType.benefitType);
  }

  get form() {
    return form({
      irnDate: ref(this.journey.steps.IRNDate, date),
      checkedIRN: text.joi(
        this.content.fields.checkedIRN.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    const irnDate = DateUtils.createMoment(
      this.fields.irnDate.day.value,
      this.fields.irnDate.month.value,
      this.fields.irnDate.year.value,
      i18next.language
    );

    const hasCheckedIRN = this.fields.checkedIRN.value === userAnswer.YES;
    const lessThan13Months = DateUtils.isLessThanOrEqualToThirteenMonths(irnDate);

    if (!hasCheckedIRN && this.req.session) {
      delete this.req.session.IRNDate;
      delete this.req.session.CheckIRN;
    }

    return branch(
      goTo(this.journey.steps.IRNOverOneMonthLate).if(hasCheckedIRN && lessThan13Months),
      goTo(this.journey.steps.IRNOverThirteenMonthsLate).if(hasCheckedIRN),
      redirectTo(this.journey.steps.IRNDate)
    );
  }
}

module.exports = CheckIRN;
