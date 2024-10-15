const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class SameAddress extends SaveToDraftStore {
  static get path() {
    return paths.appointee.sameAddress;
  }

  get form() {
    return form({
      isAddressSameAsAppointee: text.joi(
        this.content.fields.isAddressSameAsAppointee.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.isAddressSameAsAppointee.question,
      section: sections.appellantDetails,
      answer: titleise(content.cya.isAddressSameAsAppointee[this.fields.isAddressSameAsAppointee.value])
    });
  }

  values() {
    return {
      appellant: {
        isAddressSameAsAppointee: this.getIsAddressSameAsAppointee(
          this.fields.isAddressSameAsAppointee.value)
      }
    };
  }

  getIsAddressSameAsAppointee(isAddressSameAsAppointeeValue) {
    if (isAddressSameAsAppointeeValue === userAnswer.YES) return true;
    if (isAddressSameAsAppointeeValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const isAddressSameAsAppointee = this.fields.isAddressSameAsAppointee.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.TextReminders).if(isAddressSameAsAppointee),
      goTo(this.journey.steps.AppellantInUk).if(isIba(this.req)),
      goTo(this.journey.steps.AppellantContactDetails)
    );
  }
}

module.exports = SameAddress;
