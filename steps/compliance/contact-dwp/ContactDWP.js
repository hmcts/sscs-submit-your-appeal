const { shimSessionExitPoint } = require('middleware/shimSession');
const { getBenefitCode } = require('utils/stringUtils');
const paths = require('paths');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');

const allowUC = config.get('features.allowUC.enabled') === 'true';

class ContactDWP extends shimSessionExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }

  get allowUC() {
    return allowUC;
  }

  get benefitType() {
    if (this.req.session.BenefitType) {
      return getBenefitCode(this.req.session.BenefitType.benefitType);
    }
    return '';
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = ContactDWP;
