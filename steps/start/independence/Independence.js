const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getTribunalPanel } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';
const allowUC = config.get('features.allowUC.enabled') === 'true';

class Independence extends Interstitial {
  get isUserLoggedIn() {
    return this.req.idam;
  }

  static get path() {
    return paths.start.independence;
  }

  get tribunalPanel() {
    return getTribunalPanel(this.req.session.BenefitType.benefitType);
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get allowUC() {
    return allowUC;
  }

  next() {
    return branch(
      goTo(this.journey.steps.CreateAccount).if(allowSaveAndReturn),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = Independence;
