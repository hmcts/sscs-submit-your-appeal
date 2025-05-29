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
const config = require('config');
const allowNI = config.get('features.allowNI.enabled');

class RepresentativeInMainlandUk extends SaveToDraftStore {
  static get path() {
    return paths.representative.representativeInMainlandUk;
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
      inMainlandUk: text.joi(
        allowNI ?
           this.content.fields.inMainlandUk.errors.requiredNI :
           this.content.fields.inMainlandUk.errors.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: allowNI ?
         this.content.cya.inMainlandUk.questionNI :
         this.content.cya.inMainlandUk.question,
      section: sections.representative,
      answer: titleise(content.cya.inMainlandUk[this.fields.inMainlandUk.value])
    });
  }

  getInMainlandUkValue() {
    if (this.fields.inMainlandUk.value === userAnswer.YES) return true;
    if (this.fields.inMainlandUk.value === userAnswer.NO) return false;
    return null;
  }

  values() {
    return {
      representative: {
        contactDetails: {
          inMainlandUk: this.getInMainlandUkValue()
        }
      }
    };
  }

  next() {
    return branch(
      goTo(this.journey.steps.RepresentativeDetails).if(
        this.fields.inMainlandUk.value === userAnswer.YES
      ),
      goTo(this.journey.steps.RepresentativeInternationalDetails)
    );
  }
}

module.exports = RepresentativeInMainlandUk;
