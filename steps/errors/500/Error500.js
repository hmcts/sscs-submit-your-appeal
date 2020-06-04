/* eslint-disable no-throw-literal  */
const { Page } = require('@hmcts/one-per-page');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Error500 extends Page {
  static get path() {
    return '/internal-server-error';
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }

  handler() {
    throw 'HTTP 500: An internal server error has occurred';
  }
}

module.exports = Error500;
