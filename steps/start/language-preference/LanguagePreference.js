const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');

const allowESA = config.get('features.allowESA.enabled') === 'true';
const allowUC = config.get('features.allowUC.enabled') === 'true';

class LanguagePreference extends SaveToDraftStore {
  static get path() {
    return paths.start.languagePreference;
  }

  get form() {
    return form({
      languagePreferenceWelsh: text.joi(
        this.content.fields.languagePreferenceWelsh.error.required,
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
    const allowedTypes = [benefitTypes.personalIndependencePayment];
    if (allowESA) {
      allowedTypes.push(benefitTypes.employmentAndSupportAllowance);
    }
    if (allowUC) {
      allowedTypes.push(benefitTypes.universalCredit);
    }

    const isAllowedBenefit = () => allowedTypes.indexOf(this.req.session.BenefitType.benefitType) !== -1;
    return branch(
      goTo(this.journey.steps.PostcodeChecker).if(isAllowedBenefit),
      redirectTo(this.journey.steps.AppealFormDownload)
    );
  }
}

module.exports = LanguagePreference;
