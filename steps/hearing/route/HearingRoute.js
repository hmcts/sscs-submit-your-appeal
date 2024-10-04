const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('../../../utils/answer');
const sections = require('../../check-your-appeal/sections');
const { titleise } = require('../../../utils/stringUtils');
const i18next = require('i18next');

class HearingRoute extends SaveToDraftStore {
  static get path() {
    return paths.hearing.hearingRoute;
  }

  get form() {
    return form({
      hearingRoute: text.joi(
        this.content.fields.hearingRoute.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return [
      answer(this, {
        question: this.content.cya.hearingRoute.question,
        section: sections.hearingOptions,
        answer: titleise(content.cya.hearingRoute[this.fields.hearingRoute.value])
      })
    ];
  }

  next() {
    return redirectTo(this.journey.steps.HearingSupport);
  }
}

module.exports = HearingRoute;
