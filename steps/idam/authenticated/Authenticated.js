const { RestoreUserState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');

class Authenticated extends RestoreUserState {
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
}

module.exports = Authenticated;
