const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const { formatMobileNumber } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SendToNumber extends Question {
  static get path() {
    return paths.smsNotify.sendToNumber;
  }

  get phoneNumber() {
    return formatMobileNumber(this.fields.phoneNumber.value);
  }

  get form() {
    return form({
      phoneNumber: text.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber'),
      useSameNumber: text.joi(
        this.content.fields.useSameNumber.error.required,
        Joi.string().regex(whitelist).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      smsNotify: {
        useSameNumber: this.fields.useSameNumber.value === userAnswer.YES
      }
    };
  }

  next() {
    const useSameNumber = this.fields.useSameNumber.value === userAnswer.YES;

    return branch(
      redirectTo(this.journey.steps.SmsConfirmation).if(useSameNumber),
      goTo(this.journey.steps.EnterMobile)
    );
  }
}

module.exports = SendToNumber;
