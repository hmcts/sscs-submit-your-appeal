const { Page } = require('lib/vendor/one-per-page');
const paths = require('paths');

class CookiePolicy extends Page {
  static get path() {
    return paths.policy.cookiePolicy;
  }
}

module.exports = CookiePolicy;
