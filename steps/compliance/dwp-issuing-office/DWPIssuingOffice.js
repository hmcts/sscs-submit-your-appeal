const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { numbers } = require('utils/regex');
const officeIds = require('steps/compliance/dwp-issuing-office/ids');
const sections = require('steps/check-your-appeal/sections');
const { getBenefitName } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const PipNumberOnImage = require('./PipNumberOnImage');

class DWPIssuingOffice extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOffice;
  }

  get form() {
    return form({
      pipNumber: text
        .joi(
          this.content.fields.pipNumber.error.numberSameAsImage,
          Joi.string().trim().invalid(PipNumberOnImage)
        )
        .joi(
          this.content.fields.pipNumber.error.required,
          Joi.string().required()
        ).joi(
          this.content.fields.pipNumber.error.notNumeric,
          Joi.string().trim().regex(numbers)
        ).joi(
          this.content.fields.pipNumber.error.invalid,
          Joi.string().trim().valid(officeIds)
        )
    });
  }

  get benefitName() {
    return getBenefitName(this.req.session.BenefitType.benefitType);
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.pipNumber.question,
        section: sections.mrnDate,
        answer: this.fields.pipNumber.value
      })
    ];
  }

  values() {
    
    return {
      mrn: {
        dwpIssuingOffice: `DWP PIP (${this.fields.pipNumber.value})`
      }
    };
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = DWPIssuingOffice;
