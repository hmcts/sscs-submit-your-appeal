const proxyquire = require('proxyquire');
const { journey } = require('lib/vendor/one-per-page/src/flow');
const { supertest, testApp } = require('test/util/supertest');
const { OK } = require('http-status-codes');
const { expect, sinon } = require('test/util/chai');
const Page = require('lib/vendor/one-per-page/src/steps/Page');
const session = require('lib/vendor/one-per-page/src/session');

class TestPage extends Page {}
const defaultOptions = { session: { secret: 'foo' } };
const options = (...overrides) => {
  const foo = Object.assign(
    {},
    defaultOptions,
    ...overrides
  );
  return foo;
};
const handlerTest = ({ test, options: extraOptions }) => {
  const testPage = class extends TestPage {
    get name() {
      return 'TestPage';
    }
    handler(req, res) {
      test(req, res);
      res.end();
    }
  };
  const opts = options({ steps: [testPage] }, extraOptions);
  const app = journey(testApp(), opts);
  return () => supertest(app).get(testPage.path)
    .expect(200);
};


describe('journey/journey', () => {
  it('returns an express app', () => {
    const testJourney = journey(testApp(), defaultOptions);

    expect(testJourney).to.be.a('function');
    expect(testJourney).itself.to.respondTo('use');
    expect(testJourney).itself.to.respondTo('get');
    expect(testJourney).itself.to.respondTo('post');
  });

  it('binds steps to the router', () => {
    const app = journey(testApp(), options({ steps: [TestPage] }));
    return supertest(app).get(TestPage.path)
      .expect(OK);
  });

  it('binds custom routes to the router', () => {
    const routes = [
      {
        bind: app => {
          app.use('/custom-route', (req, res) => res.send());
        }
      }
    ];
    const app = journey(testApp(), options({ routes }));
    return supertest(app).get('/custom-route')
      .expect(OK);
  });

  it('throws an error if route doesnt have bind function', () => {
    const shouldThrowError = () => {
      journey(testApp(), options({ routes: [{}] }));
    };
    return expect(shouldThrowError)

      .throws('Your custom route should have a bind function i.e. bind: app => {}');
  });

  describe('req.journey', () => {
    it('is created by journey', handlerTest({
      test(req) {
        expect(req.journey).to.be.an('object');
      }
    }));

    it('binds the noSessionHandler, so sessions can access it', handlerTest({
      options: { noSessionHandler: (req, res, next) => next() },
      test(req) {
        expect(req.journey.noSessionHandler).to.be.a('function');
      }
    }));

    it('binds all steps to req.journey.[step name]', () => {
      const foo = class Foo extends TestPage {};
      const bar = class Bar extends TestPage {};
      return handlerTest({
        options: { steps: [foo, bar] },
        test(req) {
          expect(req.journey).to.have.property('Foo', foo);
          expect(req.journey).to.have.property('Bar', bar);
        }
      });
    });
  });

  describe('session option', () => {
    describe('as a function', () => {
      it('overrides the session middleware', () => {
        const sessionOverride = (req, res) => {
          res.end(`Using override, session: ${req.session}`);
        };
        const app = journey(testApp(), options({ session: sessionOverride }));
        return supertest(app)
          .get('/')
          .expect('Using override, session: undefined');
      });
    });

    describe('as an object', () => {
      it('configures the session middleware', () => {
        const spy = sinon.spy(session);
        const stubbedJourney = proxyquire(
          'lib/vendor/one-per-page/src/flow/journey',
          { '../session': spy }
        );
        const secret = 'keyboard cat';
        stubbedJourney(testApp(), { session: { secret } });
        expect(spy).calledWith(sinon.match({ secret }));
        expect(spy).calledWith(sinon.match({ cookie: {} }));
      });

      it('accepts custom cookie options', () => {
        const spy = sinon.spy(session);
        const stubbedJourney = proxyquire(
          'lib/vendor/one-per-page/src/flow/journey',
          { '../session': spy }
        );
        const cookie = { customOption: true };
        stubbedJourney(testApp(), { session: { cookie } });
        expect(spy).calledWith(sinon.match({ cookie }));
      });
    });
  });

  describe('Error pages option', () => {
    let stubbedJourney = null;
    let bindStub = null;

    beforeEach(() => {
      bindStub = sinon.stub().returns(true);
      const errorPagesStubObj = { bind: bindStub };

      stubbedJourney = proxyquire(
        'lib/vendor/one-per-page/src/flow/journey',
        { '../errors/errorPages': errorPagesStubObj }
      );
    });

    it('should register default error pages', () => {
      const app = testApp();
      stubbedJourney(app, defaultOptions);
      return expect(bindStub).to.have.been.calledWith(app, undefined);
    });

    it('should register configured error pages', () => {
      const errorPagesConfig = { template: 'sometemplate' };
      const app = testApp();

      stubbedJourney(app,
        {
          session: { secret: 'foo' },
          errorPages: errorPagesConfig
        }
      );

      return expect(bindStub).to.have.been.calledWith(app, errorPagesConfig);
    });
  });
});
