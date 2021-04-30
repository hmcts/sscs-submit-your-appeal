const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getBenefitName, getHasAcronym, getTribunalPanelWelsh, getTribunalPanel, isFeatureFlagEnabled } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');
const i18next = require('i18next');

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';

class Independence extends Interstitial {
  get isUserLoggedIn() {
    return this.req.idam;
  }

  static get path() {
    return paths.start.independence;
  }

  get tribunalPanel() {
    if (this.req.session.BenefitType) {
      if (i18next.language === 'cy') {
        return getTribunalPanelWelsh(this.req.session.BenefitType.benefitType);
      }
      return getTribunalPanel(this.req.session.BenefitType.benefitType);
    }
    return '';
  }

  get benefitType() {
    if (this.req.session.BenefitType) {
      return getBenefitCode(this.req.session.BenefitType.benefitType);
    }
    return '';
  }

  get benefitName() {
    if (this.req.session.BenefitType) {
      const sessionLanguage = i18next.language;
      const benefitTypeContent = require(`steps/start/benefit-type/content.${sessionLanguage}`);

      return benefitTypeContent.benefitTypes[getBenefitCode(this.req.session.BenefitType.benefitType).toLowerCase()];
    }
    return '';
  }

  get hasNoAcronym() {
    if (this.req.session.BenefitType) {
      return !getHasAcronym(this.req.session.BenefitType.benefitType);
    }
    return false;
  }

  get containsBenefit() {
    if (this.req.session.BenefitType) {
      return getBenefitName(this.req.session.BenefitType.benefitType).includes('Benefit');
    }
    return false;
  }

  isBenefitEnabled(featureFlag) {
    return isFeatureFlagEnabled(featureFlag);
  }

  next() {
    return branch(
      goTo(this.journey.steps.CreateAccount).if(allowSaveAndReturn && !this.req.idam),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = Independence;
