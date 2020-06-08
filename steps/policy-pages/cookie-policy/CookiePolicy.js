const { shimSessionStaticPage } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class CookiePolicy extends shimSessionStaticPage {
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
