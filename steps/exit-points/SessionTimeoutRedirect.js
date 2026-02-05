const { redirectTo } = require('lib/vendor/one-per-page/flow');
const { Redirect } = require('lib/vendor/one-per-page');
const paths = require('paths');

class SessionTimeoutRedirect extends Redirect {
  static get path() {
    return paths.session.sessionTimeoutRedirect;
  }

  next() {
    if (!this.req.idam) {
      return redirectTo(this.journey.steps.SessionTimeout);
    }
    return redirectTo(this.journey.steps.SignOut);
  }
}

module.exports = SessionTimeoutRedirect;
