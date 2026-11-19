const expressSession = require('express-session');
const config = require('config');
const RedisSessionStore = require('components/session/RedisSessionStore');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const { shimSession } = require('../session/sessionShims');
const { shimSessionStore } = require('../session/sessionStoreShims');
const { sessionStoreSerializer } = require('../session/sessionStoreSerializer');

const sessionOptions = (userOpts, store, req) => {
  const userCookie = userOpts.cookie || {};
  const cookie = Object.assign({}, {
    secure: defaultIfUndefined(userCookie.secure, req.secure),
    expires: defaultIfUndefined(userCookie.expires, false),
    domain: defaultIfUndefined(userCookie.hostname, req.hostname)
  }, userCookie);

  if (userOpts.sessionEncryption) {
    const encryptionKey = userOpts.sessionEncryption(req);
    userOpts.serializer = sessionStoreSerializer(encryptionKey);
  }

  return {
    store,
    secret: defaultIfUndefined(userOpts.secret, config.secret),
    resave: defaultIfUndefined(userOpts.resave, false),
    saveUninitialized: defaultIfUndefined(userOpts.saveUninitialized, false),
    name: defaultIfUndefined(userOpts.name, 'session'),
    cookie
  };
};

const overrides = (req, res, next) => error => {
  if (error) {
    next(error);
    return;
  }
  res.locals = res.locals || {};
  // Should page render be able to access session directly?
  res.locals.session = req.session;

  if (req.session && req.sessionStore) {
    shimSession(req, res);
    shimSessionStore(req);
    next();
  } else {
    next(new Error('Store is disconnected'));
  }
};

const setupStore = userOptions => {
  if (userOptions.store) {
    return userOptions.store;
  }

  return new RedisSessionStore({
    url: config.redis.url,
    cluster: config.redis.cluster
  });
};

const sessions = (userOptions = {}) => {
  const store = setupStore(userOptions);
  const handler = (req, res, next) => {
    const options = sessionOptions(userOptions, store, req);
    const provider = expressSession(options);
    provider(req, res, overrides(req, res, next));
  };
  return handler;
};

module.exports = sessions;
