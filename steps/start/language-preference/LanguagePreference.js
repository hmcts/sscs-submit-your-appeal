const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const benefitTypes = require('../benefit-type/types');
const { get } = require('lodash');

class LanguagePreference extends SaveToDraftStore {
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
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.languagePreferenceWelsh.question,
      section: sections.benefitType,
      answer:
        content.cya.languagePreferenceWelsh[
          this.fields.languagePreferenceWelsh.value
        ]
    });
  }

  values() {
    return {
      languagePreferenceWelsh: this.getLanguagePreferenceValue(
        this.fields.languagePreferenceWelsh.value
      )
    };
  }

  getLanguagePreferenceValue(languagePreferenceValue) {
    if (languagePreferenceValue === userAnswer.YES) return true;
    if (languagePreferenceValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const benefitType = get(
      this,
      'journey.req.session.BenefitType.benefitType'
    );
    if (benefitType === benefitTypes.infectedBloodCompensation) {
      return goTo(this.journey.steps.Independence);
    }
    return goTo(this.journey.steps.PostcodeChecker);
  }
}

module.exports = LanguagePreference;
