const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { getBenefitCode } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

const allowUC = config.get('features.allowUC.enabled') === 'true';

class HaveContactedDWP extends SaveToDraftStore {
  static get path() {
    return paths.compliance.haveContactedDWP;
  }

  get allowUC() {
    return allowUC;
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get form() {
    return form({

      haveContactedDWP: text.joi(
        this.content.fields.haveContactedDWP.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }


  next() {
    const hasContactDWP = this.fields.haveContactedDWP.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.NoMRN).if(hasContactDWP),
      goTo(this.journey.steps.ContactDWP)
    );
  }
}

module.exports = HaveContactedDWP;
