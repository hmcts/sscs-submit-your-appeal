const { RestoreFromIdamState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('middleware/idam');
const paths = require('paths');

class Authenticated extends RestoreFromIdamState {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
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
