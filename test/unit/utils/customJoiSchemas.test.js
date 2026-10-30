const { expect } = require('test/util/chai');
const customJoi = require('utils/customJoiSchemas');

let schema = null;

describe('ValidatePhone', () => {
  beforeEach(() => {
    schema = customJoi.string().validatePhone();
  });

  describe('generic phones', () => {
    it('should work for +44 numbers ', () => {
      const res = schema.validate('+447512345678');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should work for 0044 numbers', () => {
      const res = schema.validate('00447512345678');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should work for UK landlines', () => {
      const res = schema.validate('0115 933 3968');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should work with parethesis', () => {
      const res = schema.validate('(0115) 933 3968');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should work with hyphens', () => {
      const res = schema.validate('0115-933-3968');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should not work with letters', () => {
      const res = schema.validate('0044751234567a');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).not.to.equal(null);
    });

    it('should not work with malformed numbers', () => {
      const res = schema.validate('12345679890');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).not.to.equal(null);
    });
  });
  describe('mobile phones mode', () => {
    beforeEach(() => {
      schema = customJoi.string().validatePhone({ phoneType: 'MOBILE' });
    });

    it('should work for mobile numbers ', () => {
      const res = schema.validate('07512345678');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).to.equal(null);
    });

    it('should not work with landlines', () => {
      const res = schema.validate('0115 933 3968');
      const validation = { error: res.error || null, value: res.value };
      expect(validation.error).not.to.equal(null);
    });
  });
});
