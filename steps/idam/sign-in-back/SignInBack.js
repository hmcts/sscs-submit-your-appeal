const {
  goTo
} = require('@hmcts/one-per-page');
const paths = require('paths');
const {
  EntryPoint
} = require('@hmcts/one-per-page');

class SignInBack extends EntryPoint {
  static get path() {
    return paths.idam.signInBack;
  }

  next() {
    return goTo(this.journey.steps.IdamRedirect);
  }
}

module.exports = SignInBack;