const { shimSessionExitPoint } = require('middleware/shimSession');
const paths = require('paths');
const urls = require('urls');
const checkWelshToggle = require('middleware/checkWelshToggle');

class InvalidPostcode extends shimSessionExitPoint {
  static get path() {
    return paths.start.invalidPostcode;
  }

  get formUrl() {
    return urls.formDownload.sscs1;
  }

  get middleware() {
    return [
      checkWelshToggle,
      ...super.middleware
    ];
  }
}

module.exports = InvalidPostcode;
