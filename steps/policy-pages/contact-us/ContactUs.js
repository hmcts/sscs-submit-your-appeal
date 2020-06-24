const { shimSessionStaticPage } = require('middleware/shimSession');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class ContactUs extends shimSessionStaticPage {
  static get path() {
    return paths.policy.contactUs;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = ContactUs;
