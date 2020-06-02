const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');

const validValues = {
  yes: 'Yes',
  no: 'No'
};

class LanguagePreferenceWelsh extends SaveToDraftStore {
  static get path() {
    return paths.start.languagePreferenceWelsh;
  }

  get validValues() {
    return validValues;
  }

  get form() {
    const answers = [this.validValues.yes, this.validValues.no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateDisagreeReason = () => true;
    const validateCountry = () => true;

    const fields = {
      agree: text.joi(this.content.errors.required, validAnswers),
      reason: text,
      country: text
    };

    const languagePreferenceWelsh = object(fields)
      .check(
        errorFor('reason', this.content.errors.reasonRequired),
        validateDisagreeReason
      )
      .check(
        errorFor('country', this.content.errors.countryRequired),
        validateCountry
      );

    return form({ languagePreferenceWelsh });
  }

  values() {
    const agree = this.fields.languagePreferenceWelsh.agree.value;

    const values = {};
    values.respLanguagePreferenceWelshAgree = agree;
    return values;
  }
  answers() {
    const answers = [];
    answers.push(answer(this, {
      question: this.content.cya.agree,
      // eslint-disable-next-line max-len
      answer: this.fields.languagePreferenceWelsh.agree.value === this.validValues.yes ? this.content.fields.agree.answer : this.content.fields.disagree.answer
    }));
    return answers;
  }

  next() {
    return goTo(this.journey.steps.BenefitType);
  }
}

module.exports = LanguagePreferenceWelsh;
