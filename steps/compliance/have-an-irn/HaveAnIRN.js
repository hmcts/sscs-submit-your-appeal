const { goTo, branch } = require('@hmcts/one-per-page');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { isIba } = require('utils/benefitTypeUtils');

class HaveAnIRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.haveAnIRN;
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
      haveAnIRN: text.joi(
        this.content.fields.haveAnIRN.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    const hasAnIRN = this.fields.haveAnIRN.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.IRNDate).if(hasAnIRN),
      goTo(this.journey.steps.NeedIRN)
    );
  }
}

module.exports = HaveAnIRN;