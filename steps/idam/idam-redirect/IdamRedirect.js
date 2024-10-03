const { Redirect, goTo, branch } = require('@hmcts/one-per-page');
const paths = require('paths');
const idam = require('middleware/idam');
const { isIba } = require('utils/benefitTypeUtils');

class IdamRedirect extends Redirect {
  static get path() {
    return paths.start.idamRedirect;
  }

  next() {
    return branch(
      goTo(this.journey.steps.BenefitType).if(!this.req.session.BenefitType),
      goTo(this.journey.steps.HaveAnIRN).if(isIba(this.req)),
      goTo(this.journey.steps.HaveAMRN)
    );
  }

  get middleware() {
    return [
      idam.authenticate,
      ...super.middleware
    ];
  }
}

module.exports = IdamRedirect;
