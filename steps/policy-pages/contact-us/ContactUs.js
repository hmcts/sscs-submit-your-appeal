const { Page } = require('lib/vendor/one-per-page');
const paths = require('paths');

class ContactUs extends Page {
  static get path() {
    return paths.policy.contactUs;
  }
}

module.exports = ContactUs;
