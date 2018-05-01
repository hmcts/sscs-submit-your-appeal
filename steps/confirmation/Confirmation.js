const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const urls = require('urls');

class Confirmation extends ExitPoint {
  static get path() {
    return paths.confirmation;
  }

  get surveyLink() {
    return urls.surveyLink;
  }
}

module.exports = Confirmation;
