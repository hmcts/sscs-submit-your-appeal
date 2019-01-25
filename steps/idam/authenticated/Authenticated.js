const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('middleware/idam');
const paths = require('paths');

class Authenticated extends Redirect {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
    return redirectTo(this.journey.steps.Entry);
  }

  get middleware() {
    return [
      idam.landingPage,
      ...super.middleware
    ];
  }
}

module.exports = Authenticated;
