const { form, text } = require('@hmcts/one-per-page/forms');
const { Question, goTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { niNumber } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');

class AppellantNINO extends Question {
  static get path() {
    return paths.identity.enterAppellantNINO;
  }

  get form() {
    return form({
      nino: text.joi(
        this.content.fields.nino.error.required,
        Joi.string().regex(niNumber).required()
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.nino.question,
        section: sections.appellantDetails,
        answer: this.fields.nino.value
      })
    ];
  }

  values() {
    return {
      appellant: {
        nino: this.fields.nino.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantContactDetails);
  }
}

module.exports = AppellantNINO;
