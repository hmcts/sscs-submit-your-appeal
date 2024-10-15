const { AuthAndRestoreAllDraftsState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const { isIba } = require('utils/benefitTypeUtils');
const { branch } = require('@hmcts/one-per-page');

class Authenticated extends AuthAndRestoreAllDraftsState {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
    return branch(
      goTo(this.journey.steps.HaveAnIRN).if(isIba(this.req)),
      goTo(this.journey.steps.HaveAMRN)
    );
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      res.redirect(paths.drafts);
    } else {
      super.handler(req, res, next);
    }
  }
}

module.exports = Authenticated;
