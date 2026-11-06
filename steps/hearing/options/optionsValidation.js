const customJoi = require('utils/customJoiSchemas');
const Joi = require('joi');
const emailOptions = require('utils/emailOptions');

const emptyTelephoneValidation = value =>
  !(value.requested && !value.phoneNumber);
const emptyEmailValidation = value => !(value.requested && !value.email);
const optionSelected = options => {
  const optionValues = Object.values(options);
  let valueSet = false;

  optionValues.forEach(option => {
    valueSet = valueSet ? valueSet : option.requested;
  });

  return valueSet;
};

const invalidTelephoneValidation = value => {
  let res = null;
  const schema = customJoi.string().trim().validatePhone();
  if (schema && typeof schema.validate === 'function') {
    res = schema.validate(value.phoneNumber);
  } else {
    res = Joi.compile(schema).validate(value.phoneNumber);
  }
  return !value.requested || !res.error;
};

const invalidEmailValidation = value => {
  const schema = Joi.string().trim().email(emailOptions).allow('');
  const res = schema.validate(value.email);
  return !value.requested || !res.error;
};

module.exports = {
  emptyTelephoneValidation,
  invalidTelephoneValidation,
  emptyEmailValidation,
  invalidEmailValidation,
  optionSelected
};
