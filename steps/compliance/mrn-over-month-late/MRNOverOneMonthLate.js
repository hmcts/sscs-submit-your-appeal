const { goTo, branch } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { decode } = require('utils/stringUtils');
const { isIba } = require('utils/benefitTypeUtils');

const MIN_CHAR_COUNT = 5;

class MRNOverOneMonthLate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.mrnOverMonthLate;
  }

  get form() {
    return form({
      reasonForBeingLate: text
        .joi(
          this.content.fields.reasonForBeingLate.error.required,
          Joi.string().required()
        )
        .joi(
          this.content.fields.reasonForBeingLate.error.notEnough,
          Joi.string().min(MIN_CHAR_COUNT)
        )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.reasonForBeingLate.question,
        section: sections.mrnDate,
        answer: decode(this.fields.reasonForBeingLate.value)
      })
    ];
  }

  values() {
    return {
      mrn: {
        reasonForBeingLate: decode(this.fields.reasonForBeingLate.value)
      }
    };
  }

  next() {
    const benefitType = get(
      this,
      'journey.req.session.BenefitType.benefitType'
    );

    const isDWPOfficeOther =
      String(benefitType) !== benefitTypes.personalIndependencePayment;
    const isUCBenefit = String(benefitType) === 'Universal Credit (UC)';

    const isCarersAllowanceBenefit =
      String(benefitType) === benefitTypes.carersAllowance;
    const isBereavementBenefit =
      String(benefitType) === benefitTypes.bereavementBenefit;
    const isMaternityAllowance =
      String(benefitType) === benefitTypes.maternityAllowance;
    const isBereavementSupportPaymentScheme =
      String(benefitType) === benefitTypes.bereavementSupportPaymentScheme;
    const isIbaCase =
      String(benefitType) === benefitTypes.infectedBloodCompensation;

    const skipToAppointee =
      isUCBenefit ||
      isCarersAllowanceBenefit ||
      isBereavementBenefit ||
      isMaternityAllowance ||
      isBereavementSupportPaymentScheme ||
      isIbaCase ||
      isIba(this.req);

    return branch(
      goTo(this.journey.steps.AppellantRole).if(isIba(this.req)),
      goTo(this.journey.steps.Appointee).if(skipToAppointee),
      goTo(this.journey.steps.DWPIssuingOfficeEsa).if(isDWPOfficeOther),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNOverOneMonthLate;
