const { ExitPoint } = require('@hmcts/one-per-page');
const { saveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const idam = require('middleware/idam');
const paths = require('paths');

class SignOut extends ExitPoint {
  static get path() {
    return paths.idam.signOut;
  }

  static clearCookies(req, res, next) {
    res.clearCookie('__auth-token', {
      path: '/',
      domain: req.hostname,
      httpOnly: true,
      secure: true
    });
    res.clearCookie('__state', {
      path: '/',
      domain: req.hostname,
      httpOnly: true,
      secure: true
    });
    next();
  }

  get middleware() {
    return [
      this.journey.collectSteps,
      saveToDraftStore,
      idam.logout,
      ...super.middleware,
      SignOut.clearCookies
    ];
  }
}

module.exports = SignOut;
