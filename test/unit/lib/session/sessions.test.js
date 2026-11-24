const session = require('lib/vendor/one-per-page/src/session');
const proxyquire = require('proxyquire');
const { expect, sinon } = require('test/util/chai');
const {
  testApp,
  supertest,
  shouldSetCookie,
  shouldNotSetCookie
} = require('test/util/supertest');
const sessionStoreSerializer = require(
  'lib/vendor/one-per-page/src/session/sessionStoreSerializer'
);
const expressSession = require('express-session');
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const MemoryStore = expressSession.MemoryStore;

const respondOk = (req, res) => res.sendStatus(OK);
const handleError = (res, next) => {
  return error => {
    if (error && !res._header) {
      res.statusCode = error.status || INTERNAL_SERVER_ERROR;
      res.end(error.message);
    } else {
      next();
    }
  };
};

const defaults = { secret: 'keyboard cat' };

const createServer = (options, {
  respond = respondOk,
  setup = () => { /* intentionally blank */ }
} = {}) => {
  const cookieOptions = Object.assign({ maxAge: 60 * 1000 }, options.cookie);
  const opts = Object.assign({}, defaults, options, { cookie: cookieOptions });
  const s = session(opts);
  const app = testApp();

  app.use((req, res, next) => {
    setup(req, res);
    next();
  });
  app.use((req, res, next) => {
    s(req, res, handleError(res, next));
  });
  app.use(respond);

  return app;
};

const cookie = res => {
  const setCookie = res.headers['set-cookie'];
  return (setCookie && setCookie[0]) || undefined;
};

const shouldHave = number => {
  return {
    sessionsIn(store) {
      return res => {
        const promise = new Promise((resolve, reject) => {
          store.all((error, sess) => {
            if (error) {
              reject(error);
            } else {
              const currentSessions = Object.keys(sess).length;
              resolve(expect(currentSessions).to.eql(number));
            }
          });
        });
        return promise.then(() => res);
      };
    }
  };
};


describe('sessions', () => {
  it('presents an express middleware', () => {
    const s = session(defaults);
    expect(s).to.be.a('function');
  });

  describe('options', () => {
    let spy = null;
    let stubbedSessions = null;
    let sessionStoreSerializerSpy = null;
    const req = { originalUrl: '/', headers: { cookie: '' } };
    const res = {};
    const next = sinon.stub();

    beforeEach(() => {
      sessionStoreSerializerSpy = sinon
        .spy(sessionStoreSerializer, 'sessionStoreSerializer');
      spy = sinon.spy(expressSession);
      stubbedSessions = proxyquire(
        'lib/vendor/one-per-page/src/session',
        { 'express-session': spy }
      );
    });

    afterEach(() => {
      sessionStoreSerializerSpy.restore();
    });

    describe('options.store', () => {
      it('can override store', () => {
        const store = new MemoryStore();
        const s = stubbedSessions({ secret: 'foo', store });
        s(req, res, next);
        return expect(spy).calledWith(sinon.match({ store }));
      });
    });

    describe('options.cookie.domain', () => {
      it('is passed down to express-session', () => {
        const domain = 'my.awesome.site.com';
        const s = stubbedSessions({
          secret: 'foo',
          cookie: { domain }
        });
        s(req, res, next);
        return expect(spy).calledWith(sinon.match({ cookie: { domain } }));
      });
    });

    describe('options.store.serializer', () => {
      it('adds session encryption if defined', () => {
        const domain = 'my.awesome.site.com';
        const sessionEncryption = sinon.stub().returns('key');
        const s = stubbedSessions({
          secret: 'foo',
          cookie: { domain },
          sessionEncryption
        });
        s(req, res, next);
        expect(sessionStoreSerializerSpy).calledWith(sessionEncryption());
      });
      it('doesnt add session encryption if not defined', () => {
        const domain = 'my.awesome.site.com';
        const s = stubbedSessions({
          secret: 'foo',
          cookie: { domain }
        });
        s(req, res, next);
        expect(sessionStoreSerializerSpy.notCalled).to.eql(true);
      });
    });
  });

  it('bubbles up express-session errors', () => {
    const app = createServer({ secret: null });
    return supertest(app)
      .get('/')
      .expect(500);
  });

  it('creates sessions when session.generate is called', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        req.session.generate();
        res.end();
      }
    });
    return supertest(app)
      .get('/')
      .expect(200)
      .expect(shouldSetCookie(/session/))
      .then(shouldHave(1).sessionsIn(store));
  });

  it('initialises sessions when data is stored', () => {
    const store = new MemoryStore();
    const app = createServer({ store });
    return supertest(app)
      .get('/')
      .expect(200)
      .expect(shouldNotSetCookie(/session/))
      .then(shouldHave(0).sessionsIn(store));
  });

  it('destroys an existing session on generate', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        req.session.generate();
        res.end();
      }
    });
    return supertest(app)
      .get('/')
      .expect(200)
      .then(first => {
        return supertest(app)
          .get('/')
          .set('Cookie', cookie(first))
          .expect(200)
          .expect(shouldSetCookie(/session/))
          .then(second => expect(cookie(first)).to.not.eql(cookie(second)));
      })
      .then(shouldHave(1).sessionsIn(store));
  });

  it('loads sessions correctly', () => {
    const store = new MemoryStore();
    const app = createServer({ store }, {
      respond(req, res) {
        if (req.session.active()) {
          req.session.count += 1;
          res.end(`session loaded ${req.session.count}`);
        } else {
          req.session.generate();
          req.session.count = 0;
          res.end('session created');
        }
      }
    });
    const loadSession = count => {
      return res => supertest(app)
        .get('/')
        .set('Cookie', cookie(res))
        .expect(200, `session loaded ${count}`);
    };
    return supertest(app)
      .get('/')
      .expect(200, 'session created')
      .then(loadSession(1))
      .then(loadSession(2))
      .then(loadSession(3))
      .then(shouldHave(1).sessionsIn(store));
  });
});
