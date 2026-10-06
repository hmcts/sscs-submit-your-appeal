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
const { URL } = require('url');
const got = require('got');

const idTokenCookieName = '__id-token';

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

const getUserDetails = authToken => got.get(`${idamArgs.idamApiUrl}/o/userinfo`, {
  headers: {
    Authorization: `Bearer ${authToken}`,
    Accept: 'application/json'
  }
}).json()
  .then(userInfo => {
    return {
      id: userInfo.uid,
      email: userInfo.email || userInfo.sub,
      forename: userInfo.given_name,
      surname: userInfo.family_name,
      roles: userInfo.roles
    };
  });

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
    return getUserDetails(authToken)
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

const getAccessToken = (code, args) => got.post(`${args.idamApiUrl}/o/token`, {
  form: {
    grant_type: 'authorization_code',
    code,
    redirect_uri: args.redirectUri,
    client_id: args.idamClientID,
    client_secret: args.idamSecret
  },
  headers: { Accept: 'application/json' }
}).json();

const exchangeCodeForSession = (req, res, next, args) => {
  const state = idamCookies.get(req, stateCookieName) || req.query.state;
  if (!state) {
    logger.exception(new Error('State cookie does not exist'), 'middleware/idam');
    return res.redirect(args.indexUrl);
  }
  idamCookies.remove(res, stateCookieName);

  return getAccessToken(req.query.code, args)
    .then(response => {
      idamCookies.set(res, tokenCookieName, response.access_token, args.hostName);
      if (response.id_token) {
        idamCookies.set(res, idTokenCookieName, response.id_token, args.hostName);
      }
      req.cookies = req.cookies || {};
      req.cookies[tokenCookieName] = response.access_token;
      return getUserDetails(response.access_token);
    })
    .then(userDetails => {
      req.idam = { userDetails };
      next();
    })
    .catch(error => {
      logger.exception(error, 'middleware/idam');
      res.redirect(args.indexUrl);
    });
};

const buildEndSessionUrl = (req, postLogoutRedirectPath) => {
  const args = setArgsFromRequest(req);
  const idToken = req.cookies && req.cookies[idTokenCookieName];

  const endSessionUrl = new URL('/o/endSession', args.idamLoginUrl);
  endSessionUrl.searchParams.append('post_logout_redirect_uri', `${protocol}://${req.get('host')}${postLogoutRedirectPath}`);
  if (idToken) {
    endSessionUrl.searchParams.append('id_token_hint', idToken);
  }
  return endSessionUrl.href;
};

const protect = () => (req, res, next) => {
  const authToken = idamCookies.get(req, tokenCookieName);
  if (!authToken) {
    return res.redirect(idamArgs.indexUrl);
  }
  return getUserDetails(authToken)
    .then(userDetails => {
      req.idam = { userDetails };
      next();
    })
    .catch(error => {
      logger.exception(error, 'middleware/idam');
      idamCookies.remove(res, tokenCookieName);
      res.redirect(idamArgs.indexUrl);
    });
};

const loadUserDetails = () => (req, res, next) => {
  const authToken = idamCookies.get(req, tokenCookieName);
  if (!authToken) {
    return next();
  }
  return getUserDetails(authToken)
    .then(userDetails => {
      req.idam = { userDetails };
      next();
    })
    .catch(error => {
      logger.exception(error, 'middleware/idam');
      idamCookies.remove(res, tokenCookieName);
      next();
    });
};

const methods = {
  getIdamArgs: () => idamArgs,
  idTokenCookieName,
  authenticate: redirectToIdam,
  buildEndSessionUrl,
  landingPage: (req, res, next) => {
    const args = setArgsFromRequest(req);

    if (!req.query.code) {
      return redirectToIdam(req, res, next);
    }
    if (useMock) {
      return middleware.landingPage(args)(req, res, next);
    }
    return exchangeCodeForSession(req, res, next, args);
  },
  protect: () => (useMock ? middleware.protect(idamArgs) : protect()),
  logout: (req, res, next) => {
    const args = setArgsFromRequest(req);
    if (!(req.cookies && req.cookies[tokenCookieName])) {
      return next();
    }
    return middleware.logout(args)(req, res, () => {
      res.clearCookie(tokenCookieName, { domain: args.hostName });
      next();
    });
  },
  userDetails: () => (useMock ? middleware.userDetails(idamArgs) : loadUserDetails())
};

module.exports = methods;
