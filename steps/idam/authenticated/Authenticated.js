const { RestoreFromIdamState } = require('middleware/draftPetitionStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('middleware/idam');
const paths = require('paths');

class Authenticated extends RestoreFromIdamState {
  static get path() {
    return paths.idam.authenticated;
  }

  get UserDetails() {
    return JSON.stringify(this.req.idam.userDetails);
  }

  get session() {
    return JSON.stringify(this.req.session);
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
