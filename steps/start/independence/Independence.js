const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getTribunalPanel, getTribunalPanelWelsh, getHasAcronym } = require('utils/stringUtils');
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
    const sessionLanguage = i18next.language;
    const benefitTypeContent = require(`steps/start/benefit-type/content.${sessionLanguage}`);

    if (this.req.session.BenefitType) {
      if (getHasAcronym(this.req.session.BenefitType.benefitType)) {
        return getBenefitCode(this.req.session.BenefitType.benefitType);
      }
      return benefitTypeContent.benefitTypes[getBenefitCode(this.req.session.BenefitType.benefitType).toLowerCase()];
    }
    return '';
  }

  get benefitCode() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  next() {
    return branch(
      goTo(this.journey.steps.CreateAccount).if(allowSaveAndReturn && !this.req.idam),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = Independence;
