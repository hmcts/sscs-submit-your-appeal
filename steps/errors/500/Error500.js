/* eslint-disable no-throw-literal  */
const { Page } = require('lib/vendor/one-per-page');

class Error500 extends Page {
  static get path() {
    return '/internal-server-error';
  }

  handler() {
    throw 'HTTP 500: An internal server error has occurred';
  }
}

module.exports = Error500;
