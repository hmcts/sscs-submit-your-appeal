const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SendToNumber extends SaveToDraftStore {
  static get path() {
    return paths.smsNotify.sendToNumber;
  }

  get phoneNumber() {
    return this.fields.phoneNumber.value || this.fields.appointeePhoneNumber.value;
  }

  get form() {
    return form({
      phoneNumber: text.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber'),
      appointeePhoneNumber: text.ref(this.journey.steps.AppointeeContactDetails, 'phoneNumber'),
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
        useSameNumber: this.getUseSameNumber(this.fields.useSameNumber.value)
      }
    };
  }

  getUseSameNumber(userSameNumberValue) {
    if (userSameNumberValue === userAnswer.YES) return true;
    if (userSameNumberValue === userAnswer.NO) return false;
    return null;
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
