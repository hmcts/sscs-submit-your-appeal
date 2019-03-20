const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
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
      answer: titleise(this.fields.createAccount.value)
    });
  }

  values() {
    return {
      createAccount: this.fields.createAccount.value === userAnswer.YES
    };
  }

  next() {
    const createAccount = this.fields.createAccount.value === 'yes';

    return branch(
      redirectTo(this.journey.steps.IdamRedirect).if(createAccount),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = CreateAccount;
