const { redirectTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');
const { EntryPoint } = require('@hmcts/one-per-page');

class SignInBack extends EntryPoint {
  static get path() {
    return paths.idam.signInBack;
  }

  next() {
    return redirectTo(this.journey.steps.IdamRedirect);
  }
}

module.exports = SignInBack;
