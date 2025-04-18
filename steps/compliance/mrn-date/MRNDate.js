const { goTo, branch } = require('@hmcts/one-per-page/flow');
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
const { isIba } = require('utils/benefitTypeUtils');

class MRNDate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.mrnDate;
  }

  get benefitType() {
    return getBenefitCode(this.journey.req.session.BenefitType.benefitType);
  }

  get suffix() {
    return isIba(this.req) ? 'Iba' : '';
  }

  get form() {
    const fields = this.content.fields;

    return form({
      mrnDate: convert(
        d =>
          DateUtils.createMoment(
            d.day,
            DateUtils.getMonthValue(d, i18next.language),
            d.year,
            i18next.language
          ),
        date.required({
          allRequired: fields.date.error[`allRequired${this.suffix}`],
          dayRequired: fields.date.error.dayRequired,
          monthRequired: fields.date.error.monthRequired,
          yearRequired: fields.date.error.yearRequired
        })
      )
        .check(fields.date.error[`invalid${this.suffix}`], value =>
          DateUtils.isDateValid(value)
        )
        .check(fields.date.error[`future${this.suffix}`], value =>
          DateUtils.isDateInPast(value)
        )
        .check(
          fields.date.error[`dateSameAsImage${this.suffix}`],
          value => !DateUtils.mrnDateSameAsImage(value, isIba(this.req))
        )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.mrnDate[`question${this.suffix}`],
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
    const isLessThanOrEqualToAMonth =
      DateUtils.isLessThanOrEqualToAMonth(mrnDate);

    const benefitType = get(
      this,
      'journey.req.session.BenefitType.benefitType'
    );

    const isDWPOfficeOther =
      String(benefitType) !== benefitTypes.personalIndependencePayment;
    const isUCBenefit =
      benefitType &&
      String(benefitType) === 'Universal Credit (UC)' &&
      !isFeatureFlagEnabled('allowRFE');
    const isCarersAllowanceBenefit =
      String(benefitType) === benefitTypes.carersAllowance;
    const isBereavementBenefit =
      String(benefitType) === benefitTypes.bereavementBenefit;
    const isMaternityAllowance =
      String(benefitType) === benefitTypes.maternityAllowance;
    const isBereavementSupportPaymentScheme =
      String(benefitType) === benefitTypes.bereavementSupportPaymentScheme;

    const skipToAppointee =
      (isUCBenefit ||
        isCarersAllowanceBenefit ||
        isBereavementBenefit ||
        isMaternityAllowance ||
        isBereavementSupportPaymentScheme) &&
      isLessThanOrEqualToAMonth;
    const skipToAppellantRole = isIba(this.req) && isLessThanOrEqualToAMonth;
    return branch(
      goTo(this.journey.steps.AppellantRole).if(skipToAppellantRole),
      goTo(this.journey.steps.Appointee).if(skipToAppointee),
      goTo(this.journey.steps.CheckMRN).if(!isLessThanOrEqualToAMonth),
      goTo(this.journey.steps.DWPIssuingOfficeEsa).if(isDWPOfficeOther),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNDate;
