const { expect } = require('test/util/chai');
const customJoi = require('utils/customJoiSchemas');

let schema = null;

describe('ValidatePhone', () => {
  beforeEach(() => {
    schema = customJoi.string().validatePhone();
  });

  describe('generic phones', () => {
    it('should work for +44 numbers ', () => {
      const validation = customJoi.validate('+447512345678', schema);
      expect(validation.error).to.equal(null);
    });

    it('should work for 0044 numbers', () => {
      const validation = customJoi.validate('00447512345678', schema);
      expect(validation.error).to.equal(null);
    });

    it('should work for UK landlines', () => {
      const validation = customJoi.validate('0115 933 3968', schema);
      expect(validation.error).to.equal(null);
    });

    it('should work with parethesis', () => {
      const validation = customJoi.validate('(0115) 933 3968', schema);
      expect(validation.error).to.equal(null);
    });

    it('should work with hyphens', () => {
      const validation = customJoi.validate('0115-933-3968', schema);
      expect(validation.error).to.equal(null);
    });

    it('should not work with letters', () => {
      const validation = customJoi.validate('0044751234567a', schema);
      expect(validation.error).not.to.equal(null);
    });

    it('should not work with malformed numbers', () => {
      const validation = customJoi.validate('12345679890', schema);
      expect(validation.error).not.to.equal(null);
    });
  });
  describe('mobile phones mode', () => {
    beforeEach(() => {
      schema = customJoi.string().validatePhone({ phoneType: 'MOBILE' });
    });

    it('should work for mobile numbers ', () => {
      const validation = customJoi.validate('07512345678', schema);
      expect(validation.error).to.equal(null);
    });

    it('should not work with landlines', () => {
      const validation = customJoi.validate('0115 933 3968', schema);
      expect(validation.error).not.to.equal(null);
    });
  });
});
