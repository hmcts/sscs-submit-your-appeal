const { ExitPoint } = require('lib/vendor/one-per-page');
const paths = require('paths');

class Exit extends ExitPoint {
  static get path() {
    return paths.session.exit;
  }
}

module.exports = Exit;
