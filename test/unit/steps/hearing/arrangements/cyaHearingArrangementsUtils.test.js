const { expect } = require('test/util/chai');
const {
  setCYAValue
} = require('steps/hearing/arrangements/cyaHearingArrangementsUtils');
const cyaContent = require('steps/hearing/arrangements/content.en').cya;

const NOT_REQUIRED = cyaContent.notRequired;
const REQUIRED = cyaContent.required;
const hiddenFieldValue = 'Value A';

describe('cyaHearingArrangementsUtils.js', () => {
  describe('setCYAValue', () => {
    it('should return Not Required when the arrangementValue equals Not required', () => {
      expect(setCYAValue(NOT_REQUIRED, undefined)).to.equal(NOT_REQUIRED);
    });

    it('should return Required when hiddenFieldValue is undefined', () => {
      expect(setCYAValue(REQUIRED, undefined)).to.equal(REQUIRED);
    });

    it('should return Required when hiddenFieldValue is an empty string', () => {
      expect(setCYAValue(REQUIRED, '')).to.equal(REQUIRED);
    });

    it('should return the hidden field value when hiddenFieldValue is set', () => {
      expect(setCYAValue(REQUIRED, hiddenFieldValue)).to.equal(
        hiddenFieldValue
      );
    });
  });
});
