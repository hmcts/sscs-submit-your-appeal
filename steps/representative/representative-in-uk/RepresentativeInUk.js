const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const { titleise } = require('utils/stringUtils');
const { branch } = require('@hmcts/one-per-page');
const { isIba } = require('utils/benefitTypeUtils');

class RepresentativeInUk extends SaveToDraftStore {
  static get path() {
    return paths.representative.representativeInUk;
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
      inUk: text.joi(
        this.content.fields.inUk.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.inUk.question,
      section: sections.representative,
      answer: titleise(content.cya.inUk[this.fields.inUk.value])
    });
  }

  next() {
    return branch(
      goTo(this.journey.steps.RepresentativeDetails).if(this.fields.inUk.value === userAnswer.YES),
      goTo(this.journey.steps.RepresentativeInternationalDetails)
    );
  }
}

module.exports = RepresentativeInUk;
