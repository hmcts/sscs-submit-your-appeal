const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const idamWrapper = require('@hmcts/div-idam-express-middleware/wrapper');
const idamCookies = require('@hmcts/div-idam-express-middleware/utilities/cookies');
const { tokenCookieName, stateCookieName } = require('@hmcts/div-idam-express-middleware/config');
const config = require('config');
const paths = require('paths');
const Base64 = require('js-base64').Base64;
const i18next = require('i18next');
const logger = require('logger');

const redirectUri = `${config.node.baseUrl}${paths.idam.authenticated}`;
const isDevMode = ['development'].includes(process.env.NODE_ENV);
const useMockIdam = config.get('services.idam.useMock') === 'true';
const useMock = isDevMode && useMockIdam;

const idamArgs = {
  redirectUri,
  indexUrl: paths.session.root,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId,
  scope: 'openid profile roles'
};

let middleware = idamExpressMiddleware;
const protocol = config.get('node.protocol');

// eslint-disable-next-line no-warning-comments
// TODO fix mock middleware to enable this condition
if (useMock) {
  middleware = idamExpressMiddlewareMock;
}

const setArgsFromRequest = req => {
  const sessionLanguage = i18next.language;
  // clone args so we don't modify the global idamArgs
  const args = Object.assign({}, idamArgs);
  args.hostName = req.hostname;
  args.language = sessionLanguage ? sessionLanguage : 'en';
  args.redirectUri = `${protocol}://${req.get('host') + config.paths.authenticated}`;

  args.state = () =>
    Base64.encodeURI(
      JSON.stringify({
        BenefitType: req.session.BenefitType,
        PostcodeChecker: req.session.PostcodeChecker
      })
    );

  return args;
};

const redirectToIdamLogin = (args, res) => {
  const state = args.state();
  idamCookies.set(res, stateCookieName, state, args.hostName);
  const idamLoginUrl = idamWrapper.setup(args).getIdamLoginUrl({ state, scope: args.scope });
  res.redirect(idamLoginUrl);
};

const redirectToIdam = (req, res, next) => {
  const args = setArgsFromRequest(req);
  if (useMock) {
    return middleware.authenticate(args)(req, res, next);
  }

  if (idamCookies.get(req, stateCookieName)) {
    idamCookies.remove(res, stateCookieName);
  }

  const authToken = req.cookies && req.cookies[tokenCookieName];
  if (authToken) {
    return idamWrapper.setup(args).getUserDetails(authToken)
      .then(userDetails => {
        req.idam = { userDetails };
        next();
      })
      .catch(error => {
        logger.exception(error, 'middleware/idam');
        redirectToIdamLogin(args, res);
      });
  }

  return redirectToIdamLogin(args, res);
};

const methods = {
  getIdamArgs: () => idamArgs,
  authenticate: redirectToIdam,
  landingPage: (req, res, next) => {
    const args = setArgsFromRequest(req);

    if (req.query.code) {
      middleware.landingPage(args)(req, res, next);
    } else {
      redirectToIdam(req, res, next);
    }
  },
  protect: (...args) => middleware.protect(idamArgs, ...args),
  logout: (req, res, next) => {
    const args = setArgsFromRequest(req);
    middleware.logout(args)(req, res, next);
  },
  userDetails: () => middleware.userDetails(idamArgs)
};

module.exports = methods;
