const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');
const paths = require('paths');

const redirectUri = `${config.node.baseUrl}${paths.idam.authenticated}`;

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
if (['development'].includes(process.env.NODE_ENV)) {
  middleware = idamExpressMiddlewareMock;
}

const setArgsFromRequest = req => {
  // clone args so we don't modify the global idamArgs
  const args = Object.assign({}, idamArgs);
  args.hostName = req.hostname;
  args.redirectUri = `${protocol}://${req.get('host') + config.paths.authenticated}`;
  args.state = () => JSON.stringify({
    BenefitType: req.session.BenefitType,
    PostcodeChecker: req.session.PostcodeChecker
  });

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
    middleware.landingPage(args)(req, res, next);
  },
  protect: (...args) => middleware.protect(idamArgs, ...args),
  logout: (...args) => middleware.logout(idamArgs, ...args),
  userDetails: () => middleware.userDetails(idamArgs)
};

module.exports = methods;
