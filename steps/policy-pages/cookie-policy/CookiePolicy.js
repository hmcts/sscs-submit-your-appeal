const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class CookiePolicy extends Question {
  static get path() {
    return paths.policy.cookiePolicy;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = CookiePolicy;
