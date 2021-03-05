const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');
const i18next = require('i18next');

const allowESA = config.get('features.allowESA.enabled') === 'true';
const allowUC = config.get('features.allowUC.enabled') === 'true';
const allowDLA = config.get('features.allowDLA.enabled') === 'true';

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
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.languagePreferenceWelsh.question,
      section: sections.benefitType,
      answer: content.cya.languagePreferenceWelsh[this.fields.languagePreferenceWelsh.value]
    });
  }

  values() {
    return {
      languagePreferenceWelsh: this.getLanguagePreferenceValue(this.fields.languagePreferenceWelsh.value)
    };
  }

  getLanguagePreferenceValue(languagePreferenceValue) {
    if (languagePreferenceValue === userAnswer.YES) return true;
    if (languagePreferenceValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const allowedTypes = [benefitTypes.personalIndependencePayment];
    if (allowESA) {
      allowedTypes.push(benefitTypes.employmentAndSupportAllowance);
    }
    if (allowUC) {
      allowedTypes.push(benefitTypes.universalCredit);
    }
    if (allowDLA) {
      allowedTypes.push(benefitTypes.disabilityLivingAllowance);
    }

    const isAllowedBenefit = () => allowedTypes.indexOf(this.req.session.BenefitType.benefitType) !== -1;
    return branch(
      goTo(this.journey.steps.PostcodeChecker).if(isAllowedBenefit),
      redirectTo(this.journey.steps.AppealFormDownload)
    );
  }
}

module.exports = LanguagePreference;
