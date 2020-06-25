const { shimSessionSaveToDraftStore } = require('middleware/shimSession');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class LanguagePreference extends shimSessionSaveToDraftStore {
  static get path() {
    return paths.start.languagePreference;
  }

  get form() {
    return form({
      languagePreferenceWelsh: text.joi(
        this.content.fields.languagePreferenceWelsh.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = LanguagePreference;
