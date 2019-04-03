const { RestoreFromIdamState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('middleware/idam');
const paths = require('paths');

class Authenticated extends RestoreFromIdamState {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
    return goTo(this.journey.steps.HaveAMRN);
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      res.redirect(paths.checkYourAppeal);
    } else {
      super.handler(req, res, next);
    }
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.landingPage
    ];
  }
}

module.exports = Authenticated;
