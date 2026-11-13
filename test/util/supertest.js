const express = require('express');
const supertest = require('supertest');
const session = require('lib/vendor/one-per-page/src/session');
const { expressNunjucks } = require('express-nunjucks');
const domino = require('domino');
const zepto = require('zepto-node');
const { expect } = require('test/util/chai');
const { i18nMiddleware } = require('lib/vendor/one-per-page/src/i18n/i18Next');
const { defined } = require('lib/vendor/one-per-page/src/util/checks');
const { RequestBoundJourney } = require('lib/vendor/one-per-page/src/flow');
const cookieParser = require('cookie-parser');
const path = require('path');

function testApp() {
  const app = express();

  const viewsDirs = [
    path.resolve(__dirname, '../../test/views'),
    path.resolve(__dirname, '../../test/steps/check-your-answers/fixtures')
  ];

  app.set('views', viewsDirs);
  app.set('view engine', 'html');

  expressNunjucks(app);

  return app;
}

const cookies = res => res.headers['set-cookie'] || [];

const _supertest = Symbol('supertest');
const _app = Symbol('app');
const _middleware = Symbol('middleware');

const supertestInstance = stepDSL => {
  if (stepDSL[_supertest]) return stepDSL[_supertest];

  const app = testApp(stepDSL.viewsDirs);
  stepDSL[_app] = app;

  app.use((req, res, next) => {
    // setup req.journey (added by Journey)
    const steps = { [stepDSL.step.name]: stepDSL.step };
    req.journey = new RequestBoundJourney(req, res, steps, {});
    next();
  });

  app.use(session({ secret: 'keyboard cat' }));
  app.use(cookieParser());
  app.use(i18nMiddleware);

  app.get('/supertest-check-session', (req, res) => {
    const currentSession = Object.assign(
      {},
      req.session,
      { active: req.session.active() }
    );
    res.end(JSON.stringify(currentSession));
  });

  stepDSL[_middleware].forEach(_ => app.use(_));
  stepDSL.step.bind(app);
  stepDSL[_supertest] = supertest(app);

  return stepDSL[_supertest];
};

const wrapWithResponseAssertions = supertestObj => {
  supertestObj.html = assertions => {
    return supertestObj.then(res => {
      const _window = domino.createWindow(res.text);
      const $ = zepto(_window);
      return assertions($);
    });
  };
  supertestObj.text = assertions => {
    return supertestObj.then(res => {
      return assertions(res.text);
    });
  };
  supertestObj.session = assertions => {
    return supertestObj.then(res => {
      // const sid = cookies(res);
      return supertest(supertestObj.app)
        .get('/supertest-check-session')
        .set('Cookie', cookies(res))
        .expect(200);
    }).then(res => {
      const currentSession = JSON.parse(res.text);
      return Promise.all([assertions(currentSession)]);
    });
  };
  return supertestObj;
};

const shouldNotSetCookie = name => res => {
  if (typeof res.headers['set-cookie'] !== 'undefined') {
    return expect(res.headers['set-cookie']).to.not.include.match(name);
  }
  return expect(Object.keys(res.headers)).to.not.include('set-cookie');
};

const shouldSetCookie = name => {
  return res => Promise.all([
    expect(Object.keys(res.headers)).to.include('set-cookie'),
    expect(res.headers['set-cookie']).to.include.match(name)
  ]).then(() => res);
};

const constructorFrom = step => {
  if (defined(step.prototype)) {
    return step;
  }
  throw new Error(`Pass ${step.name} to supertest as a class not an instance`);
};

class TestStepDSL {
  constructor(step, body = {}, middleware = []) {
    this.step = constructorFrom(step);
    this.body = body;
    this[_middleware] = middleware;
    this.viewDirs = [];
  }

  static create(step) {
    return new TestStepDSL(step);
  }

  withSession(sessionData) {
    return this.withMiddleware((req, res, next) => {
      req.session.generate();
      req.session = Object.assign(req.session, sessionData);
      next();
    });
  }

  withField(field, value) {
    const newBody = Object.assign({}, this.body, { [field]: value });
    return new TestStepDSL(this.step, newBody, this[_middleware]);
  }

  withSetup(setup) {
    return this.withMiddleware((req, res, next) => {
      setup(req, res);
      next();
    });
  }

  withViews(...viewDirs) {
    this.viewsDirs = [...viewDirs, ...this.viewDirs];
    return this;
  }

  withMiddleware(newMiddleware) {
    const middleware = [...this[_middleware], newMiddleware];
    return new TestStepDSL(this.step, this.body, middleware);
  }

  execute(method, maybePath) {
    // eslint-disable-next-line no-shadow
    const path = defined(maybePath) ? maybePath : this.step.path;
    const testExecution = supertestInstance(this)[method](path);
    return wrapWithResponseAssertions(testExecution);
  }

  get(maybePath) {
    return this.execute('get', maybePath);
  }
  post(maybePath) {
    const postRequest = this.execute('post', maybePath);
    if (Object.keys(this.body).length !== 0) {
      return postRequest
        .type('form')
        .send(this.body);
    }
    return postRequest;
  }
  patch(maybePath) {
    return this.execute('patch', maybePath);
  }
  put(maybePath) {
    return this.execute('put', maybePath);
  }
  delete(maybePath) {
    return this.execute('delete', maybePath);
  }
}

module.exports = {
  supertest,
  testApp,
  testStep: TestStepDSL.create,
  shouldNotSetCookie,
  shouldSetCookie,
  wrapWithResponseAssertions
};
