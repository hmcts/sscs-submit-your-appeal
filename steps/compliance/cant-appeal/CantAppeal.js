const { ExitPoint } = require('lib/vendor/one-per-page');
const paths = require('paths');

class CantAppeal extends ExitPoint {
  static get path() {
    return paths.compliance.cantAppeal;
  }
}

module.exports = CantAppeal;
