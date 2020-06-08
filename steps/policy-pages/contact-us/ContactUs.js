const { shimSessionStaticPage } = require('middleware/shimSession');
const { goTo } = require('@hmcts/one-per-page/flow');
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

  next() {
    return goTo(this.journey.steps.contactUs);
  }
}

module.exports = ContactUs;
