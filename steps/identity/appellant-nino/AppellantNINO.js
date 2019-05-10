const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { niNumber } = require('utils/regex');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');

class AppellantNINO extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantNINO;
  }

  isAppointee() {
    return get(this, 'journey.req.session.Appointee.isAppointee') === 'yes';
  }

  contentPrefix() {
    return this.isAppointee() ? 'withAppointee' : 'withoutAppointee';
  }

  get title() {
    return this.content.title[this.contentPrefix()];
  }

  get subtitle() {
    return this.content.subtitle[this.contentPrefix()];
  }

  get form() {
    return form({
      nino: text.joi(
        this.content.fields.nino.error.required[this.contentPrefix()],
        Joi.string().regex(niNumber).required()
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.nino.question,
        section: sections.appellantDetails,
        answer: this.fields.nino.value
      })
    ];
  }

  values() {
    return {
      appellant: {
        nino: this.fields.nino.value.trim()
      }
    };
  }

  next() {
    if (this.isAppointee()) {
      return goTo(this.journey.steps.SameAddress);
    }
    return redirectTo(this.journey.steps.AppellantContactDetails);
  }
}

module.exports = AppellantNINO;
