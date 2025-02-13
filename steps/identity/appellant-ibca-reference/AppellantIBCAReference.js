const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { ibcaReference } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');
const { isIba } = require('utils/benefitTypeUtils');

class AppellantIBCAReference extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantIBCAReference;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get form() {
    return form({
      ibcaReference: text
        .joi(
          this.content.fields.ibcaReference.error.required,
          Joi.string().required()
        )
        .joi(
          this.content.fields.ibcaReference.error.invalid,
          Joi.string().trim().regex(ibcaReference)
        )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.ibcaReference.question,
        section: sections.appellantDetails,
        answer: this.fields.ibcaReference.value.toUpperCase()
      })
    ];
  }

  values() {
    return {
      appellant: {
        ibcaReference: this.fields.ibcaReference.value.toUpperCase()
      }
    };
  }

  next() {
    return goTo(this.journey.steps.MRNDate);
  }
}

module.exports = AppellantIBCAReference;
