const { expect } = require('test/util/chai');
const PrivacyPolicyTest = require('steps/policy-pages/privacy-policy/PrivacyPolicy');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('PrivacyPolicy.js', () => {
  describe('get path()', () => {
    it('returns path /privacy-policy', () => {
      expect(PrivacyPolicyTest.path).to.equal(paths.policy.privacy);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new PrivacyPolicyTest({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(5);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
