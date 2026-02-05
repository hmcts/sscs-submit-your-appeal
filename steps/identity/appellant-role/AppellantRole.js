const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('lib/vendor/one-per-page/flow');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class AppellantRole extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantRole;
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
      ibcRole: text.joi(
        this.content.fields.ibcRole.error.required,
        Joi.string().required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.ibcRole.question,
      section: sections.appellantDetails,
      answer: content.cya.ibcRole[this.fields.ibcRole.value]
    });
  }

  values() {
    return {
      appellant: {
        ibcRole: this.fields.ibcRole.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppellantName);
  }
}

module.exports = AppellantRole;
