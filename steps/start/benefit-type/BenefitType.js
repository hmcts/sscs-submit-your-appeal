const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { splitBenefitType, getBenefitCode, isFeatureFlagEnabled } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { isIba } = require('utils/benefitTypeUtils');
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
    const benefitTypeContent = require(`steps/start/benefit-type/content.${sessionLanguage}`);

    const benTypeKey = getBenefitCode(this.fields.benefitType.value).toLowerCase();

    return answer(this, {
      question: this.content.cya.benefitType.question,
      section: sections.benefitType,
      answer: benefitTypeContent.benefitTypes[benTypeKey]
    });
  }

  values() {
    return {
      benefitType: splitBenefitType(this.fields.benefitType.value)
    };
  }

  getAllowedTypes() {
    const allowedTypes = [
      benefitTypes.personalIndependencePayment,
      benefitTypes.employmentAndSupportAllowance,
      benefitTypes.universalCredit,
      benefitTypes.infectedBloodAppeal
    ];

    const featureFlags = [
      { flag: 'allowDLA', benefit: benefitTypes.disabilityLivingAllowance },
      { flag: 'allowCA', benefit: benefitTypes.carersAllowance },
      { flag: 'allowAA', benefit: benefitTypes.attendanceAllowance },
      { flag: 'allowBB', benefit: benefitTypes.bereavementBenefit },
      { flag: 'allowIIDB', benefit: benefitTypes.industrialInjuriesDisablement },
      { flag: 'allowJSA', benefit: benefitTypes.jobseekersAllowance },
      { flag: 'allowSF', benefit: benefitTypes.socialFund },
      { flag: 'allowMA', benefit: benefitTypes.maternityAllowance },
      { flag: 'allowIS', benefit: benefitTypes.incomeSupport },
      { flag: 'allowBSPS', benefit: benefitTypes.bereavementSupportPaymentScheme },
      { flag: 'allowIDB', benefit: benefitTypes.industrialDeathBenefit },
      { flag: 'allowPC', benefit: benefitTypes.pensionCredit },
      { flag: 'allowRP', benefit: benefitTypes.retirementPension }
    ];

    allowedTypes.push(
      ...featureFlags
        .filter(f => isFeatureFlagEnabled(f.flag))
        .map(f => f.benefit)
    );

    return allowedTypes;
  }

  next() {
    const allowedTypes = this.getAllowedTypes();
    const isAllowedBenefit = () => allowedTypes.includes(this.fields.benefitType.value);
    if (process.env.FT_WELSH === 'true' || config.features.welsh.enabled === 'true') {
      return branch(
        goTo(this.journey.steps.LanguagePreference).if(isAllowedBenefit),
        redirectTo(this.journey.steps.AppealFormDownload)
      );
    } else if (this.fields.benefitType.value === benefitTypes.infectedBloodAppeal) {
      return goTo(this.journey.steps.Independence);
    }
    return branch(
      goTo(this.journey.steps.PostcodeChecker).if(isAllowedBenefit),
      redirectTo(this.journey.steps.AppealFormDownload)
    );
  }
}

module.exports = BenefitType;
