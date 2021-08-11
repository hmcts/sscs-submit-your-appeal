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

const MIN_CHAR_COUNT = 5;

class MRNOverOneMonthLate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.mrnOverMonthLate;
  }

  get form() {
    return form({
      reasonForBeingLate: text.joi(
        this.content.fields.reasonForBeingLate.error.required,
        Joi.string().required()
      ).joi(
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
    const useDWPOfficeESA = [benefitTypes.employmentAndSupportAllowance];
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');

    const isDWPOfficeESA = () => useDWPOfficeESA.indexOf(benefitType) !== -1;
    const isUCBenefit = String(benefitType) === 'Universal Credit (UC)';

    const isCarersAllowanceBenefit = String(benefitType) === benefitTypes.carersAllowance;
    const isBereavementBenefit = String(benefitType) === benefitTypes.bereavementBenefit;
    const isMaternityAllowance = String(benefitType) === benefitTypes.maternityAllowance;
    const isBereavementSupportPaymentScheme = String(benefitType) === benefitTypes.bereavementSupportPaymentScheme;

    return branch(
      goTo(this.journey.steps.Appointee).if(isUCBenefit || isCarersAllowanceBenefit || isBereavementBenefit || isMaternityAllowance ||
        isBereavementSupportPaymentScheme),
      goTo(this.journey.steps.DWPIssuingOfficeEsa).if(isDWPOfficeESA),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNOverOneMonthLate;
