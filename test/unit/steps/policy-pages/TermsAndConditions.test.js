const { expect } = require('test/util/chai');
const TermsAndConditionsTest = require('steps/policy-pages/terms-and-conditions/TermsAndConditions');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('TermsAndConditions.js', () => {
  describe('get path()', () => {
    it('returns path /terms-and-conditions', () => {
      expect(TermsAndConditionsTest.path).to.equal(paths.policy.termsAndConditions);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new TermsAndConditionsTest({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(5);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
