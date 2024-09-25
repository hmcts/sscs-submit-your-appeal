const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class NeedMRN extends ExitPoint {
  static get path() {
    return paths.compliance.needMRN;
  }
}

module.exports = NeedMRN;
