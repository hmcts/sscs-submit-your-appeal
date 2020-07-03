const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

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
