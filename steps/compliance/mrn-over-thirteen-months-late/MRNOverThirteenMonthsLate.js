const { goTo, branch } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftPetitionStoreMiddleware');
const { get } = require('lodash');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

const MIN_CHAR_COUNT = 5;

class MRNOverThirteenMonthsLate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.mrnOverThirteenMonthsLate;
  }

  get form() {
    return form({
      reasonForBeingLate: text.joi(
        this.content.fields.reasonForBeingLate.error.required,
        Joi.string().required()
      ).joi(
        this.content.fields.reasonForBeingLate.error.notEnough,
        Joi.string().min(MIN_CHAR_COUNT)
      ).joi(
        this.content.fields.reasonForBeingLate.error.invalid,
        Joi.string().regex(whitelist)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.reasonForBeingLate.question,
        section: sections.mrnDate,
        answer: this.fields.reasonForBeingLate.value
      })
    ];
  }

  values() {
    return {
      mrn: {
        reasonForBeingLate: this.fields.reasonForBeingLate.value
      }
    };
  }

  next() {
    const useDWPOfficeESA = [benefitTypes.employmentAndSupportAllowance];
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');

    const isDWPOfficeESA = () => useDWPOfficeESA.indexOf(benefitType) !== -1;

    return branch(
      goTo(this.journey.steps.DWPIssuingOfficeEsa).if(isDWPOfficeESA),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNOverThirteenMonthsLate;
