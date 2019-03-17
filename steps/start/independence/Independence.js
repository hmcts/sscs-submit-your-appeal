const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const { getBenefitCode, getTribunalPanel } = require('utils/stringUtils');
const paths = require('paths');

class Independence extends Interstitial {
  static get path() {
    return paths.start.independence;
  }

  get tribunalPanel() {
    return getTribunalPanel(this.req.session.BenefitType.benefitType);
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  next() {
    return goTo(this.journey.steps.CreateAccount);
  }
}

module.exports = Independence;
