const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const regex = require('utils/regex');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SmsConfirmation extends Question {
  static get path() {
    return paths.smsNotify.smsConfirmation;
  }

  get mobileNumber() {
    const isMobile = regex.internationalMobileNumber.test(this.fields.phoneNumber.value);
    let number = null;

    if (isMobile) {
      if (this.fields.useSameNumber.value === userAnswer.YES) {
        number = this.fields.phoneNumber.value;
      } else {
        number = this.fields.enterMobile.value;
      }
    } else {
      number = this.fields.enterMobile.value;
    }

    return number;
  }

  get form() {
    return form({
      enterMobile: text.ref(this.journey.steps.EnterMobile, 'enterMobile'),
      useSameNumber: text.ref(this.journey.steps.SendToNumber, 'useSameNumber'),
      phoneNumber: text.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber')
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.mobileNumber.question,
        section: sections.textMsgReminders,
        answer: this.mobileNumber,
        url: paths.smsNotify.appellantTextReminders
      })
    ];
  }

  values() {
    const values = { smsNotify: {} };
    values.smsNotify.useSameNumber = this.fields.useSameNumber.value === userAnswer.YES;

    if (values.smsNotify.useSameNumber) {
      values.smsNotify.smsNumber = this.fields.phoneNumber.value;
    } else {
      values.smsNotify.smsNumber = this.fields.enterMobile.value;
    }

    return values;
  }

  next() {
    return goTo(this.journey.steps.Representative);
  }
}

module.exports = SmsConfirmation;
