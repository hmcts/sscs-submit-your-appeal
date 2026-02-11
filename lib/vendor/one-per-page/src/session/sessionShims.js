const { defined } = require('../util/checks');
const defaultIfUndefined = require('../util/defaultIfUndefined');

const activeProperty = Symbol('active');
const setActive = (session, value) => {
  Object.defineProperty(session, activeProperty, {
    enumerable: false,
    value: value || session[activeProperty],
    writable: true
  });
};

const active = req => () => req.session && req.session[activeProperty];

const hydrate = req => () => {
  if (defined(req.session) && defined(req.session.metadata)) {
    const isActive = defaultIfUndefined(req.session.metadata.active, false);
    delete req.session.metadata;
    setActive(req.session, isActive);
  }
};

const dehydrate = req => () => {
  if (defined(req.session[activeProperty])) {
    const metadata = { active: req.session[activeProperty] };
    return Object.assign({}, req.session, { metadata });
  }
  throw new Error('Session not correctly shimmed.');
};

const shimSession = (req, res) => {
  req.session.active = active(req);
  req.session.hydrate = hydrate(req);
  req.session.dehydrate = dehydrate(req);
  /* eslint-disable no-use-before-define */
  req.session.generate = generate(req, res);
  /* eslint-enable */
  req.session.hydrate();
  return req.session;
};

const generate = (req, res) => () => {
  if (req.session && typeof req.session.id === 'string') {
    req.session.destroy();
  }
  req.sessionStore.generate(req);
  setActive(req.session, true);

  shimSession(req);
  res.locals = {};
  res.locals.session = req.session;

  return req.session;
};

module.exports = { activeProperty, shimSession };
