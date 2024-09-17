const { expect } = require('test/util/chai');
const customJoi = require('utils/customJoiSchemas');

let schema = null;

describe('ValidatePhone', () => {
  beforeEach(() => {
    schema = customJoi.string().validatePhone();
  });

  describe('generic phones', () => {
    it('should work for +44 numbers ', () => {
      const validation = schema.validate('+447512345678');
      expect(validation.error).to.equal(undefined);
    });

    it('should work for 0044 numbers', () => {
      const validation = schema.validate('00447512345678');
      expect(validation.error).to.equal(undefined);
    });

    it('should work for UK landlines', () => {
      const validation = schema.validate('0115 933 3968');
      expect(validation.error).to.equal(undefined);
    });

    it('should work with parethesis', () => {
      const validation = schema.validate('(0115) 933 3968');
      expect(validation.error).to.equal(undefined);
    });

    it('should work with hyphens', () => {
      const validation = schema.validate('0115-933-3968');
      expect(validation.error).to.equal(undefined);
    });

    it('should not work with letters', () => {
      const validation = schema.validate('0044751234567a');
      expect(validation.error).not.to.equal(undefined);
    });

    it('should not work with malformed numbers', () => {
      const validation = schema.validate('12345679890');
      expect(validation.error).not.to.equal(undefined);
    });
  });
  describe('mobile phones mode', () => {
    beforeEach(() => {
      schema = customJoi.string().validatePhone({ phoneType: 'MOBILE' });
    });

    it('should work for mobile numbers ', () => {
      const validation = schema.validate('07512345678');
      expect(validation.error).to.equal(undefined);
    });


    it('should not work with landlines', () => {
      const validation = schema.validate('0115 933 3968');
      expect(validation.error).not.to.equal(undefined);
    });
  });
});