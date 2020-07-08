const { expect } = require('test/util/chai');
const CookiePolicyTest = require('steps/policy-pages/cookie-policy/CookiePolicy');
const paths = require('paths');

describe('CookiePolicy.js', () => {
  describe('get path()', () => {
    it('returns path /cookie-policy', () => {
      expect(CookiePolicyTest.path).to.equal(paths.policy.cookiePolicy);
    });
  });
});
