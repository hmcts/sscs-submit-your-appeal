const { goTo, branch, redirectTo } = require('lib/vendor/one-per-page/flow');
const { form, text, date, ref } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { getBenefitCode } = require('utils/stringUtils');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class CheckMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.checkMRNDate;
  }

  get benefitType() {
    return getBenefitCode(this.journey.req.session.BenefitType.benefitType);
  }

  get form() {
    return form({
      mrnDate: ref(this.journey.steps.MRNDate, date),
      checkedMRN: text.joi(
        this.content.fields.checkedMRN.error.required,
        Joi.string()
          .valid(...[userAnswer.YES, userAnswer.NO])
          .required()
      )
    });
  }

  get suffix() {
    return isIba(this.req) ? 'Iba' : '';
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    const mrnDate = DateUtils.createMoment(
      this.fields.mrnDate.day.value,
      this.fields.mrnDate.month.value,
      this.fields.mrnDate.year.value,
      i18next.language
    );

    const hasCheckedMRN = this.fields.checkedMRN.value === userAnswer.YES;
    const lessThan13Months =
      DateUtils.isLessThanOrEqualToThirteenMonths(mrnDate);

    if (!hasCheckedMRN && this.req.session) {
      delete this.req.session.MRNDate;
      delete this.req.session.CheckMRN;
    }

    return branch(
      goTo(this.journey.steps.MRNOverOneMonthLate).if(
        hasCheckedMRN && lessThan13Months
      ),
      goTo(this.journey.steps.MRNOverThirteenMonthsLate).if(hasCheckedMRN),
      redirectTo(this.journey.steps.MRNDate)
    );
  }
}

module.exports = CheckMRN;
