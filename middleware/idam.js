const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');
const paths = require('paths');
const Base64 = require('js-base64').Base64;
const i18next = require('i18next');

const redirectUri = `${config.node.baseUrl}${paths.idam.authenticated}`;
const isDevMode = ['development'].includes(process.env.NODE_ENV);
const useMockIdam = config.get('services.idam.useMock') === 'true';

const idamArgs = {
  redirectUri,
  indexUrl: paths.session.root,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId
};

let middleware = idamExpressMiddleware;
const protocol = config.get('node.protocol');

// eslint-disable-next-line no-warning-comments
// TODO fix mock middleware to enable this condition
if (isDevMode && useMockIdam) {
  middleware = idamExpressMiddlewareMock;
}

const setArgsFromRequest = (req) => {
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

const methods = {
  getIdamArgs: () => idamArgs,
  authenticate: (req, res, next) => {
    const args = setArgsFromRequest(req);
    middleware.authenticate(args)(req, res, next);
  },
  landingPage: (req, res, next) => {
    const args = setArgsFromRequest(req);

    if (req.query.code) {
      middleware.landingPage(args)(req, res, next);
    } else {
      middleware.authenticate(args)(req, res, next);
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
