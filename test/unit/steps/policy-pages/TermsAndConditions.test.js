const { expect } = require('test/util/chai');
const TermsAndConditionsTest = require('steps/policy-pages/terms-and-conditions/TermsAndConditions');
const paths = require('paths');

describe('TermsAndConditions.js', () => {
  describe('get path()', () => {
    it('returns path /terms-and-conditions', () => {
      expect(TermsAndConditionsTest.path).to.equal(
        paths.policy.termsAndConditions
      );
    });
  });
});
