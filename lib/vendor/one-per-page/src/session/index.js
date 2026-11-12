const expressSession = require('express-session');

let RedisStore = null;
try {
  // connect-redis may be an ESM module or provide a default export; handle both cases safely
  // Do not call at module load-time if it's not available — we'll fall back to MemoryStore in tests.
  const connectRedis = require('connect-redis');

  if (typeof connectRedis === 'function') {
    RedisStore = connectRedis(expressSession);
  } else {
    RedisStore = (connectRedis && typeof connectRedis.default === 'function' ?
      connectRedis.default(expressSession) :
      null);
  }
} catch {
  RedisStore = null;
}
const config = require('config');
const { isTest } = require('../util/nodeEnv');
const defaultIfUndefined = require('../util/defaultIfUndefined');
const { shimSession } = require('../session/sessionShims');
const { shimSessionStore } = require('../session/sessionStoreShims');
const { sessionStoreSerializer } = require('../session/sessionStoreSerializer');

const MemoryStore = expressSession.MemoryStore;

const redisOrInMemory = (options = {}) => {
  const redisOptions = options.redis || {};

  if (isTest) {
    return new MemoryStore();
  }

  if (!RedisStore) {
    // If Redis store isn't available at runtime, fall back to in-memory store
    return new MemoryStore();
  }

  // there's quite poor default connection handling in the version of the redis client used here
  // ideally we would upgrade and switch to ioredis but this repository is on life support
  // so just doing a hardening while I'm here
  // also es-lint 80 character line length is rediculous but I'm not going to dig into it more currently
  // I didn't manage to get logging working inside the framework, so console.log it is
  if (!redisOptions.retry_strategy) {
    redisOptions.retry_strategy = clientOpts => {
      const { error, attempt } = clientOpts;

      const minRetryFactor = 300;
      const retryTime = attempt * minRetryFactor;
      const maxRetryWait = 5000;
      const exponentialBackoffInMillis = Math.min(retryTime, maxRetryWait);

      const errorMessage = `retrying attempt ${attempt} next retry will be in ${exponentialBackoffInMillis}ms`;
      if (error) {
        // take actions or throw exception

        console.log(`${new Date().toISOString()} Redis connection failed with ${error.code}, ${errorMessage}`);
      } else {
        console.log(`${new Date().toISOString()} Redis connection failed, ${errorMessage}`);
      }

      // reconnect after
      return exponentialBackoffInMillis;
    };
  }

  return new RedisStore(redisOptions);
};

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

  const store = redisOrInMemory(userOptions);


  // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
  // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md

  if (RedisStore && (typeof RedisStore === 'function') && (store instanceof RedisStore)) {
    const oneMinute = 60000;
    setInterval(() => {
      const client = store.client;
      if (client.connected) {
        client.ping();
      }
    }, oneMinute);
    store.client.ping();
  }
  return store;
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
