const { ExitPoint } = require('@hmcts/one-per-page');
const { getBenefitCode } = require('utils/stringUtils');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');

class ContactDWP extends ExitPoint {
  static get path() {
    return paths.compliance.contactDWP;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get benefitType() {
    if (this.req.session.BenefitType) {
      return getBenefitCode(this.req.session.BenefitType.benefitType);
    }
    return '';
  }
}

module.exports = ContactDWP;
