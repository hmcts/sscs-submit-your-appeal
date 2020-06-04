const { shimSessionInterstitial } = require('middleware/shimSession');
const { goTo, branch } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getTribunalPanel } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';
const allowUC = config.get('features.allowUC.enabled') === 'true';

class Independence extends shimSessionInterstitial {
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

  get allowUC() {
    return allowUC;
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }

  next() {
    return branch(
      goTo(this.journey.steps.CreateAccount).if(allowSaveAndReturn && !this.req.idam),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = Independence;
