const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { splitBenefitType, getBenefitCode } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');
const i18next = require('i18next');

const allowESA = config.get('features.allowESA.enabled') === 'true';
const allowUC = config.get('features.allowUC.enabled') === 'true';
const allowDLA = config.get('features.allowDLA.enabled') === 'true';

class BenefitType extends SaveToDraftStore {
  static get path() {
    return paths.start.benefitType;
  }
  get form() {
    const types = Object.values(benefitTypes);
    return form({
      benefitType: text.joi(
        this.content.fields.benefitType.error.required,
        Joi.string().valid(types).required()
      )
    });
  }

  answers() {
    const sessionLanguage = i18next.language;
    const benefitTypeContent = require(`steps/start/benefit-type/content.${sessionLanguage}`);

    return answer(this, {
      question: this.content.cya.benefitType.question,
      section: sections.benefitType,
      answer: benefitTypeContent.benefitTypes[getBenefitCode(this.fields.benefitType.value).toLowerCase()]
    });
  }

  values() {
    return {
      benefitType: splitBenefitType(this.fields.benefitType.value)
    };
  }

  next() {
    if (process.env.FT_WELSH === 'true' || config.features.welsh.enabled === 'true') {
      return goTo(this.journey.steps.LanguagePreference);
    }

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
    const isAllowedBenefit = () => allowedTypes.indexOf(this.fields.benefitType.value) !== -1;
    return branch(
      goTo(this.journey.steps.PostcodeChecker).if(isAllowedBenefit),
      redirectTo(this.journey.steps.AppealFormDownload)
    );
  }
}

module.exports = BenefitType;
