const { ExitPoint } = require('@hmcts/one-per-page');
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
    res.clearCookie(idam.idTokenCookieName, {
      path: '/',
      domain: req.hostname,
      httpOnly: true,
      secure: true
    });
    next();
  }

  static redirectToIdamEndSessionIfSignedIn(req, res, next) {
    const wasSignedIn = Boolean(req.cookies && req.cookies['__auth-token']);
    if (!wasSignedIn) {
      return next();
    }
    return res.redirect(idam.buildEndSessionUrl(req, paths.idam.signOut));
  }

  get middleware() {
    return [idam.logout, ...super.middleware, SignOut.clearCookies, SignOut.redirectToIdamEndSessionIfSignedIn];
  }
}

module.exports = SignOut;
