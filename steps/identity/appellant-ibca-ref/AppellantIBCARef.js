const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { ibcaRef } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');
const { isIba } = require('utils/benefitTypeUtils');

class AppellantIBCARef extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantIBCARef;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get title() {
    return this.content.title;
  }

  get subtitle() {
    return this.content.subtitle;
  }

  get form() {
    return form({
      ibcaRef: text.joi(
        this.content.fields.ibcaRef.error.required,
        Joi.string().required()
      ).joi(
        this.content.fields.ibcaRef.error.invalid,
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
    return goTo(this.journey.steps.IRNDate);
  }
}

module.exports = AppellantIBCARef;
