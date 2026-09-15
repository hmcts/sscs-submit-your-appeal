const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const {
  splitBenefitType,
  getBenefitCode
} = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { isIba, getAllowedBenefitTypes } = require('utils/benefitTypeUtils');
const config = require('config');
const i18next = require('i18next');

class BenefitType extends SaveToDraftStore {
  static get path() {
    return paths.start.benefitType;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
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
    const benefitTypeContent = require(
      `steps/start/benefit-type/content.${sessionLanguage}`
    );

    const benTypeKey = getBenefitCode(
      this.fields.benefitType.value
    ).toLowerCase();
    return answer(this, {
      question: this.content.cya.benefitType.question,
      section: sections.benefitType,
      answer: benefitTypeContent.benefitTypes[benTypeKey],
      hide: isIba(this.req)
    });
  }

  values() {
    return {
      benefitType: splitBenefitType(this.fields.benefitType.value)
    };
  }

  next() {
    const allowedTypes = getAllowedBenefitTypes();
    const isAllowedBenefit = () =>
      allowedTypes.includes(this.fields.benefitType.value);
    if (
      process.env.FT_WELSH === 'true' ||
      config.features.welsh.enabled === 'true'
    ) {
      return branch(
        goTo(this.journey.steps.LanguagePreference).if(isAllowedBenefit),
        redirectTo(this.journey.steps.AppealFormDownload)
      );
    } else if (
      this.fields.benefitType.value === benefitTypes.infectedBloodCompensation
    ) {
      return goTo(this.journey.steps.Independence);
    }
    return branch(
      goTo(this.journey.steps.PostcodeChecker).if(isAllowedBenefit),
      redirectTo(this.journey.steps.AppealFormDownload)
    );
  }
}

module.exports = BenefitType;
