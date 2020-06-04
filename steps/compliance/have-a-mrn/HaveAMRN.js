const { goTo, branch } = require('@hmcts/one-per-page');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { getBenefitCode } = require('utils/stringUtils');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

const allowUC = config.get('features.allowUC.enabled') === 'true';


class HaveAMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.haveAMRN;
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get allowUC() {
    return allowUC;
  }

  get form() {
    return form({
      haveAMRN: text.joi(
        this.content.fields.haveAMRN.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    const hasAMRN = this.fields.haveAMRN.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.MRNDate).if(hasAMRN),
      goTo(this.journey.steps.HaveContactedDWP)
    );
  }
}

module.exports = HaveAMRN;
