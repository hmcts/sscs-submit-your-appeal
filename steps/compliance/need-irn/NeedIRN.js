const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class NeedIRN extends ExitPoint {
  static get path() {
    return paths.compliance.needIRN;
  }
}

module.exports = NeedIRN;
