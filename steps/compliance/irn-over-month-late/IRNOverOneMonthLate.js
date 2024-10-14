const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const { decode } = require('utils/stringUtils');
const { isIba } = require('utils/benefitTypeUtils');

const MIN_CHAR_COUNT = 5;

class IRNOverOneMonthLate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.irnOverMonthLate;
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
      reasonForBeingLate: text.joi(
        this.content.fields.reasonForBeingLate.error.required,
        Joi.string().required()
      ).joi(
        this.content.fields.reasonForBeingLate.error.notEnough,
        Joi.string().min(MIN_CHAR_COUNT)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.reasonForBeingLate.question,
        section: sections.irnDate,
        answer: decode(this.fields.reasonForBeingLate.value)
      })
    ];
  }

  values() {
    return {
      irn: {
        reasonForBeingLate: decode(this.fields.reasonForBeingLate.value)
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantName);
  }
}

module.exports = IRNOverOneMonthLate;
