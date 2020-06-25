const { shimSessionExitPoint } = require('middleware/shimSession');
const idam = require('middleware/idam');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

class SignOut extends shimSessionExitPoint {
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
      idam.logout,
      ...super.middleware,
      SignOut.clearCookies,
      checkWelshToggle
    ];
  }
}

module.exports = SignOut;
