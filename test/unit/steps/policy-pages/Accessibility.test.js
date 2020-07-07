const { expect } = require('test/util/chai');
const AccessibilityTest = require('steps/policy-pages/accessibility/Accessibility');
const paths = require('paths');

describe('Accessibility.js', () => {
  describe('get path()', () => {
    it('returns path /accessibility', () => {
      expect(AccessibilityTest.path).to.equal(paths.policy.accessibility);
    });
  });
});
