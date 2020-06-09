const { expect } = require('test/util/chai');
const AccessibilityTest = require('steps/policy-pages/accessibility/Accessibility');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('Accessibility.js', () => {
  describe('get path()', () => {
    it('returns path /accessibility', () => {
      expect(AccessibilityTest.path).to.equal(paths.policy.accessibility);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new AccessibilityTest({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(9);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});
