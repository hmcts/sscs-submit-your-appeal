const { expect } = require('test/util/chai');
const CookiePolicyTest = require('steps/policy-pages/cookie-policy/CookiePolicy');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('CookiePolicy.js', () => {
  describe('get path()', () => {
    it('returns path /cookie-policy', () => {
      expect(CookiePolicyTest.path).to.equal(paths.policy.cookiePolicy);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new CookiePolicyTest({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(5);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
