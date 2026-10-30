const { goTo } = require('lib/vendor/one-per-page');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');

class NoMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.noMRN;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get form() {
    return form({
      reasonForNoMRN: text.joi(
        this.content.fields.reasonForNoMRN.error.required,
        Joi.string().required()
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.reasonForNoMRN.question,
        section: sections.mrnDate,
        answer: this.fields.reasonForNoMRN.value
      })
    ];
  }

  values() {
    return {
      mrn: {
        reasonForNoMRN: this.fields.reasonForNoMRN.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.StillCanAppeal);
  }
}

module.exports = NoMRN;
