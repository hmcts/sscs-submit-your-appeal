const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const urls = require('urls');
const checkWelshToggle = require('middleware/checkWelshToggle');

class InvalidPostcode extends ExitPoint {
  static get path() {
    return paths.start.invalidPostcode;
  }

  get formUrl() {
    return urls.formDownload.sscs1;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = InvalidPostcode;
