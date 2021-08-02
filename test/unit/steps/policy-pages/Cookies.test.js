const { expect } = require('test/util/chai');
const CookiesTest = require('steps/policy-pages/cookie-policy/Cookies');
const paths = require('paths');

describe('Cookies.js', () => {
  describe('get path()', () => {
    it('returns path /cookies', () => {
      expect(CookiesTest.path).to.equal(paths.policy.cookies);
    });
  });
});
