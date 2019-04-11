const { RestoreFromIdamState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');

class Authenticated extends RestoreFromIdamState {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }
}

module.exports = Authenticated;
