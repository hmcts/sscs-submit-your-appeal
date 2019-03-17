const { Question } = require('@hmcts/one-per-page');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('middleware/idam');
const paths = require('paths');

class Authenticated extends Question {
  static get path() {
    return paths.idam.authenticated;
  }

  get UserDetails() {
    return JSON.stringify(this.req.idam.userDetails);
  }
  next() {
    // return redirectTo(this.journey.steps.CheckYourAppeal);
    return goTo(this.journey.steps.CheckYourAppeal);
  }

  get middleware() {
    return [
      idam.landingPage,
      ...super.middleware
    ];
  }
}

module.exports = Authenticated;
