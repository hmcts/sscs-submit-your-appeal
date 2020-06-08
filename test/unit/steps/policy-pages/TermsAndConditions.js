const { expect } = require('test/util/chai');
const TermsAndConditions = require('steps/policy-pages/Accessibility');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('TermsAndConditions.js', () => {
  describe('get path()', () => {
    it('returns path /terms-and-conditions', () => {
      expect(TermsAndConditions.path).to.equal(paths.policy.termsAndConditions);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new TermsAndConditions({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(6);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
