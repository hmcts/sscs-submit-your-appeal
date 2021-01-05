const { RestoreAllDraftsState } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const config = require('config');

const multipleDraftsEnabled = config.get('features.multipleDraftsEnabled.enabled') === 'true';

class Authenticated extends RestoreAllDraftsState {
  static get path() {
    return paths.idam.authenticated;
  }

  next() {
    return goTo(this.journey.steps.HaveAMRN);
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      if (multipleDraftsEnabled) {
        res.redirect(paths.drafts);
      } else {
        res.redirect(paths.checkYourAppeal);
      }
    } else {
      super.handler(req, res, next);
    }
  }
}

module.exports = Authenticated;
