const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { ibcaReference } = require('utils/regex');
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
    return this.content.title[this.contentPrefix()];
  }

  get subtitle() {
    return this.content.subtitle[this.contentPrefix()];
  }

  get form() {
    return form({
      ibcaReference: text.joi(
        this.content.fields.ibcaReference.error[this.contentPrefix()].required,
        Joi.string().required()
      ).joi(
        this.content.fields.ibcaReference.error[this.contentPrefix()].invalid,
        Joi.string().trim().regex(ibcaReference)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.ibcaReference.question,
        section: sections.appellantDetails,
        answer: this.fields.ibcaReference.value
      })
    ];
  }

  values() {
    return {
      appellant: {
        ibcaReference: this.fields.ibcaReference.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.MRNDate);
  }
}

module.exports = AppellantIBCARef;
