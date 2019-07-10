const { ExitPoint } = require('@hmcts/one-per-page');
const idam = require('middleware/idam');
const paths = require('paths');

class SignOut extends ExitPoint {
  static get path() {
    return paths.idam.signOut;
  }

  get middleware() {
    return [
      idam.logout,
      ...super.middleware
    ];
  }
}

module.exports = SignOut;