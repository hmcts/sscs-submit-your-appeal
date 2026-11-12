const BaseStep = require('lib/vendor/one-per-page/src/steps/BaseStep');
const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { testStep } = require('test/util/supertest');
const { expect, sinon } = require('test/util/chai');

const { NotImplemented } = require('lib/vendor/one-per-page/src/errors/expectImplemented');

describe('steps/BaseStep', () => {
  {
    const unimplementedStep = () => new class extends BaseStep {}();

    it('expects handler to be implemented', () => {
      return expect(unimplementedStep)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('handler');
    });
  }

  {
    const Step = class extends BaseStep {
      handler(req, res) {
        res.status(OK);
        res.end();
      }
    };

    it('executes the handler when ready', () => {
      const willResolve = new Promise(resolve => resolve('Done'));
      const step = class extends Step {
        constructor(...args) {
          super(...args);
          this.waitFor(willResolve);
        }
      };
      return testStep(step).get()
        .expect(OK);
    });

    it('returns 500 if not ready', () => {
      const tooLong = new Promise(() => { /* intentionally blank */ });
      const step = class extends Step {
        constructor(...args) {
          super(...args);
          this.waitFor(tooLong);
        }
      };
      return testStep(step).get()
        .expect(INTERNAL_SERVER_ERROR, /step not ready/);
    });
  }

  describe('#router', () => {
    {
      const req = { journey: {} };
      const res = {};
      const step = new class extends BaseStep {
        handler() { /* intentionally empty */ }
      }(req, res);

      it('returns an express router', () => {
        expect(step.router).to.be.a('function');
        expect(step.router).itself.to.respondTo('use');
        expect(step.router).itself.to.respondTo('get');
        expect(step.router).itself.to.respondTo('post');
      });

      it('memoises the router', () => {
        expect(step.router).to.eql(step.router);
      });
    }

    it('binds the handler function to the current path', () => {
      const step = class extends BaseStep {
        handler(req, res) {
          res.status(OK).json({ status: 'ok', path: this.path });
        }
      };
      return testStep(step).get()
        .expect(OK, { status: 'ok', path: step.path });
    });

    it('binds the current step to req.currentStep', () => {
      const test = class extends BaseStep {
        handler(req, res) {
          expect(req.currentStep).to.eql(this);
          res.end();
        }
      };
      return testStep(test).get()
        .expect(OK);
    });
  });

  describe('#middleware', () => {
    it('are executed before the request handler', () => {
      const fooAdder = (req, res, next) => {
        req.foo = 'Foo';
        next();
      };

      const step = class extends BaseStep {
        get middleware() {
          return [fooAdder];
        }
        handler(req, res) {
          res.status(OK).json({ foo: req.foo });
        }
      };
      return testStep(step).get()
        .expect(OK, { foo: 'Foo' });
    });
  });

  describe('#dirname', () => {
    it('returns the path to the file containing the step', () => {
      const req = { journey: {} };
      const res = {};
      const step = new class Foo extends BaseStep {
        handler() { /* intentionally blank */ }
      }(req, res);
      expect(step.dirname).to.eql(__dirname);
    });
  });

  describe('#path', () => {
    it('defaults to a slugged class name', () => {
      const req = { journey: {} };
      const res = {};
      const foo = new class Foo extends BaseStep {
        handler() { /* intentionally blank */ }
      }(req, res);
      expect(foo.path).to.eql('/foo');

      const fooBar = new class FooBar extends BaseStep {
        handler() { /* intentionally blank */ }
      }(req, res);
      expect(fooBar.path).to.eql('/foo-bar');
      const base = new class extends BaseStep {
        handler() { /* intentionally blank */ }
      }(req, res);
      expect(base.path).to.eql('/');
    });

    it('is backwards compatible to old #url', () => {
      const req = { journey: {} };
      const res = {};
      const step = new class extends BaseStep {
        get url() {
          return '/test-step';
        }
        handler() { /* intentionally blank */ }
      }(req, res);
      expect(step.path).to.eql('/test-step');
    });
  });

  describe('#waitFor', () => {
    it('adds the given promise to the steps list of promises', () => {
      const req = { journey: {} };
      const res = {};
      const step = new class extends BaseStep {
        handler() { /* intentionally blank */ }
      }(req, res);
      const promise = new Promise(resolve => resolve('Done'));
      step.waitFor(promise);
      expect(step.promises).to.eql([promise]);
    });
  });

  describe('#ready', () => {
    const req = { journey: {} };
    const res = {};
    const step = new class extends BaseStep {
      handler() { /* intentionally blank */ }
    }(req, res);
    const stubTimeout = sinon.stub().returns(50);

    beforeEach(() => {
      step.promises = [];
      sinon.stub(step, 'timeoutDelay').get(stubTimeout);
    });

    afterEach(() => {
      stubTimeout.reset();
    });

    it('resolves when the steps promises resolve', () => {
      const willResolve = new Promise(resolve => resolve('Done'));
      step.promises = [willResolve];
      return expect(step.ready()).to.be.fulfilled;
    });

    it('rejects if one of the promises rejects', () => {
      const willReject = new Promise((resolve, reject) => reject(new Error()));
      step.promises = [willReject];
      return expect(step.ready()).to.be.rejected;
    });

    it('rejects if promises timeout', () => {
      const tooLong = new Promise(() => { /* intentionally blank */ });
      step.promises = [tooLong];
      return expect(step.ready()).to.be.rejected;
    });

    it('calls step.timeoutDelay to get the time to wait', () => {
      return step.ready().then(() => {
        expect(stubTimeout).calledOnce;
      });
    });
  });

  describe('#timeoutDelay', () => {
    it('returns 50 if no global timeoutDelay set', () => {
      const journey = {};
      const step = new class extends BaseStep {
        handler() { /* intentionally blank */ }
      }({ journey }, {});

      expect(step.timeoutDelay).to.eql(50);
    });

    it('returns the global timeoutDelay', () => {
      const journey = { settings: { timeoutDelay: 100 } };
      const step = new class extends BaseStep {
        handler() { /* intentionally blank */ }
      }({ journey }, {});

      expect(step.timeoutDelay).to.eql(100);
    });
  });
});
