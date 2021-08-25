const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class Cookies extends Page {
  static get path() {
    return paths.policy.cookies;
  }
}

module.exports = Cookies;
