const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const config = require('config');

const allowAppointee = config.get('features.allowAppointee.enabled') === 'true';

class Appointee extends SaveToDraftStore {
  static get path() {
    return paths.identity.areYouAnAppointee;
  }

  get form() {
    return form({
      isAppointee: text.joi(
        this.content.fields.isAppointee.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, {
      question: this.content.cya.isAppointee.question,
      section: sections.appointeeDetails,
      answer: titleise(this.fields.isAppointee.value)
    });
  }

  values() {
    return {
      isAppointee: this.fields.isAppointee.value === userAnswer.YES
    };
  }

  next() {
    const isAppointee = this.fields.isAppointee.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.AppointeeName).if(allowAppointee && isAppointee),
      redirectTo(this.journey.steps.AppealFormDownload).if(isAppointee),
      goTo(this.journey.steps.AppellantName)
    );
  }
}

module.exports = Appointee;
