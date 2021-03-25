const { goTo, branch } = require('@hmcts/one-per-page');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { getBenefitCode, getBenefitName } = require('utils/stringUtils');

class HaveAMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.haveAMRN;
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get benefitName() {
    return getBenefitName(this.req.session.BenefitType.benefitType);
  }

  get form() {
    return form({
      haveAMRN: text.joi(
        this.content.fields.haveAMRN.error.required,
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
    const hasAMRN = this.fields.haveAMRN.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.MRNDate).if(hasAMRN),
      goTo(this.journey.steps.HaveContactedDWP)
    );
  }
}

module.exports = HaveAMRN;
