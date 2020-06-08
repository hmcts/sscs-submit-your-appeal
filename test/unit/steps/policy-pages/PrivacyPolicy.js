const { expect } = require('test/util/chai');
const PrivacyPolicy = require('steps/policy-pages/PrivacyPolicy');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('PrivacyPolicy.js', () => {
  describe('get path()', () => {
    it('returns path /privacy-policy', () => {
      expect(PrivacyPolicy.path).to.equal(paths.policy.privacy);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new PrivacyPolicy({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(6);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
