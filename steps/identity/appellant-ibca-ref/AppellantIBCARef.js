const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, redirectTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { ibcaRef } = require('utils/regex');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');

class AppellantIBCARef extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantIBCARef;
  }

  isAppointee() {
    return String(get(this, 'journey.req.session.Appointee.isAppointee')) === 'yes';
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
      ibcaRef: text.joi(
        this.content.fields.ibcaRef.error[this.contentPrefix()].required,
        Joi.string().required()
      ).joi(
        this.content.fields.ibcaRef.error[this.contentPrefix()].invalid,
        Joi.string().trim().regex(ibcaRef)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.ibcaRef.question,
        section: sections.appellantDetails,
        answer: this.fields.ibcaRef.value
      })
    ];
  }

  values() {
    return {
      appellant: {
        ibcaRef: this.fields.ibcaRef.value
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

module.exports = AppellantIBCARef;