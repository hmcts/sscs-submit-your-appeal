const { ExitPoint } = require('@hmcts/one-per-page');
const { getBenefitCode } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

const allowUC = config.get('features.allowUC.enabled') === 'true';

class ContactDWP extends ExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }

  get allowUC() {
    return allowUC;
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }
}

module.exports = ContactDWP;
