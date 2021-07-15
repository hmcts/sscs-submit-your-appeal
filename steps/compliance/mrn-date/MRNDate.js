const { goTo, branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { getBenefitCode, isFeatureFlagEnabled } = require('utils/stringUtils');
const i18next = require('i18next');

class MRNDate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.mrnDate;
  }

  get benefitType() {
    return getBenefitCode(this.journey.req.session.BenefitType.benefitType);
  }

  get form() {
    const fields = this.content.fields;

    return form({
      mrnDate: convert(
        d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d, i18next.language), d.year, i18next.language),
        date.required({
          allRequired: fields.date.error.allRequired,
          dayRequired: fields.date.error.dayRequired,
          monthRequired: fields.date.error.monthRequired,
          yearRequired: fields.date.error.yearRequired
        })
      ).check(
        fields.date.error.invalid,
        value => DateUtils.isDateValid(value)
      ).check(
        fields.date.error.future,
        value => DateUtils.isDateInPast(value)
      ).check(
        fields.date.error.dateSameAsImage,
        value => !DateUtils.mrnDateSameAsImage(value)
      )

    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.mrnDate.question,
        section: sections.mrnDate,
        answer: DateUtils.formatDate(this.fields.mrnDate.value, 'DD MMMM YYYY')

      })
    ];
  }

  values() {
    return {
      mrn: {
        date: this.fields.mrnDate.value.format('DD-MM-YYYY'),
        dateAppealSubmitted: DateUtils.getCurrentDate()
      }
    };
  }

  next() {
    const mrnDate = this.fields.mrnDate.value;
    const isLessThanOrEqualToAMonth = DateUtils.isLessThanOrEqualToAMonth(mrnDate);
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');

    const isUCBenefit = benefitType && String(benefitType) === 'Universal Credit (UC)' && !isFeatureFlagEnabled('allowRFE');
    const isCarersAllowanceBenefit = String(benefitType) === benefitTypes.carersAllowance;
    const isBereavementBenefit = String(benefitType) === benefitTypes.bereavementBenefit;
    const isMaternityAllowance = String(benefitType) === benefitTypes.maternityAllowance;

    const skipToAppointee = (isUCBenefit || isCarersAllowanceBenefit || isBereavementBenefit || isMaternityAllowance) && isLessThanOrEqualToAMonth;

    return branch(
      goTo(this.journey.steps.Appointee).if(skipToAppointee),
      redirectTo(this.journey.steps.CheckMRN).if(!isLessThanOrEqualToAMonth),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNDate;
