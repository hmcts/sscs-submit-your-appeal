const { redirectTo } = require('@hmcts/one-per-page/flow');
const { Redirect } = require('@hmcts/one-per-page');
const paths = require('paths');
const idam = require('middleware/idam');
const { isIba } = require('utils/benefitTypeUtils');

class IdamRedirect extends Redirect {
  static get path() {
    return paths.start.idamRedirect;
  }

  next() {
    if (!this.req.session.BenefitType) {
      return redirectTo(this.journey.steps.BenefitType);
    } else if (isIba(this.req)) {
      return redirectTo(this.journey.steps.HaveAnIRN);
    }
    return redirectTo(this.journey.steps.HaveAMRN);
  }

  get middleware() {
    return [
      idam.authenticate,
      ...super.middleware
    ];
  }
}

module.exports = IdamRedirect;
