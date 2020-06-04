const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class NoMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.noMRN;
  }

  get form() {
    return form({
      reasonForNoMRN: text.joi(
        this.content.fields.reasonForNoMRN.error.required,
        Joi.string().required()
      )
    });
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.reasonForNoMRN.question,
        section: sections.mrnDate,
        answer: this.fields.reasonForNoMRN.value
      })
    ];
  }

  values() {
    return {
      mrn: {
        reasonForNoMRN: this.fields.reasonForNoMRN.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.StillCanAppeal);
  }
}

module.exports = NoMRN;
