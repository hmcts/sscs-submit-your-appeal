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
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

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

  get appointedBy() {
    return isIba(this.req) ? 'a court' : 'DWP';
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.isAppointee.question,
      section: sections.appointeeDetails,
      answer: titleise(content.cya.isAppointee[this.fields.isAppointee.value])
    });
  }

  values() {
    return {
      isAppointee: this.getIsAppointeeValue(this.fields.isAppointee.value)
    };
  }

  getIsAppointeeValue(appointeeValue) {
    if (appointeeValue === userAnswer.YES) return true;
    if (appointeeValue === userAnswer.NO) return false;
    return null;
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
