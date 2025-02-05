const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const paths = require('paths');
const customJoi = require('utils/customJoiSchemas');

class EnterMobile extends SaveToDraftStore {
  static get path() {
    return paths.smsNotify.enterMobile;
  }

  get form() {
    return form({
      enterMobile: text
        .joi(
          this.content.fields.enterMobile.error.emptyField,
          Joi.string().required()
        )
        .joi(
          this.content.fields.enterMobile.error.invalidNumber,
          customJoi.string().trim().validatePhone({ phoneType: 'MOBILE' })
        )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      smsNotify: {
        smsNumber: this.fields.enterMobile.value
      }
    };
  }

  next() {
    return redirectTo(this.journey.steps.SmsConfirmation);
  }
}

module.exports = EnterMobile;
