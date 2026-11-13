const { testStep } = require('test/util/supertest');
const { expect } = require('test/util/chai');
const Redirect = require('lib/vendor/one-per-page/src/steps/Redirect');
const { redirectTo } = require('lib/vendor/one-per-page/src/flow');

describe('steps/Redirect', () => {
  it('expects #next to be implemented', () => {
    const req = { journey: {} };
    const res = {};
    const noNextDefined = () => new class extends Redirect {}(req, res);
    expect(noNextDefined).to.throw(/must implement next/);
  });

  describe('GET', () => {
    it('redirects to the step defined in #next', () => {
      const fakeStep = { path: '/bar' };
      const redirect = class extends Redirect {
        next() {
          return redirectTo(fakeStep);
        }
      };
      return testStep(redirect)
        .get()
        .expect('Location', fakeStep.path)
        .expect(302);
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      const fakeStep = { path: '/bar' };
      const redirect = class extends Redirect {
        next() {
          return redirectTo(fakeStep);
        }
      };
      return testStep(redirect)
        .post()
        .expect(405);
    });
  });
});
