const { expect } = require('test/util/chai');
const PrivacyPolicyTest = require('steps/policy-pages/privacy-policy/PrivacyPolicy');
const paths = require('paths');

describe('PrivacyPolicy.js', () => {
  describe('get path()', () => {
    it('returns path /privacy-policy', () => {
      expect(PrivacyPolicyTest.path).to.equal(paths.policy.privacy);
    });
  });
});
