const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class CreateAccount extends Question {
  static get path() {
    return paths.start.createAccount;
  }

  get form() {
    return form({
      createAccount: text.joi(
        this.content.fields.createAccount.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, {
      question: this.content.cya.createAccount.question,
      section: sections.representative,
      answer: titleise(this.fields.createAccount.value)
    });
  }

  values() {
    return {
      createAccount: this.fields.createAccount.value === userAnswer.YES
    };
  }

  next() {
    return goTo(this.journey.steps.Authenticated);
  }
}

module.exports = CreateAccount;
