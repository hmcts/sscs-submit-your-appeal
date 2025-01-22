const { expect } = require('test/util/chai');
const AccessibilityTest = require('steps/policy-pages/accessibility/Accessibility');
const paths = require('paths');

describe('Accessibility.js', () => {
  let accessibility = null;

  beforeEach(() => {
    accessibility = new AccessibilityTest({
      session: {
        BenefitType: {
          benefitType: {}
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /accessibility', () => {
      expect(AccessibilityTest.path).to.equal(paths.policy.accessibility);
    });
  });

  describe('suffix()', () => {
    it('should return Iba for IBA case', () => {
      accessibility.req.hostname = 'iba-sya-hostname';
      expect(accessibility.suffix).to.eql('Iba');
    });

    it('should return empty for non IBA case', () => {
      accessibility.req.hostname = 'benefit-normal-hostname';
      expect(accessibility.suffix).to.eql('');
    });
  });
});
