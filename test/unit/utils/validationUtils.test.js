const { expect } = require('test/util/chai');
const { joiValidation } = require('utils/validationUtils');
const { whitelist } = require('utils/regex');
const Joi = require('joi');

describe('joiValidation', () => {
  it('should return true if value has been set', () => {
    const valid = joiValidation('field has a value', Joi.string().required());
    expect(valid).to.equal(true);
  });

  it('should return false if value hasn\'t been set', () => {
    const valid = joiValidation(null, Joi.string().required());
    expect(valid).to.equal(false);
  });

  it('should return true if value is valid', () => {
    const valid = joiValidation('valid value!', Joi.string().regex(whitelist));
    expect(valid).to.equal(true);
  });

  it('should return false if value isn\'t valid', () => {
    const valid = joiValidation('<invalid value>', Joi.string().regex(whitelist));
    expect(valid).to.equal(false);
  });
});
