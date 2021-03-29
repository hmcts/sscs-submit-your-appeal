const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getTribunalPanel, isFeatureFlagEnabled } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');

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
