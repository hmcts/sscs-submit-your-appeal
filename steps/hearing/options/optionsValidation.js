const Joi = require('joi');

const emptyTelephoneValidation = value => (!(value.requested && !value.phoneNumber));
const emptyEmailValidation = value => (!(value.requested && !value.email));
const optionSelected = options => {
  const optionValues = Object.values(options);
  let valueSet = false;

  optionValues.forEach(option => {
    valueSet = valueSet ? valueSet : option.requested;
  });

  return valueSet;
};

const invalidTelephoneValidation = value => {
  const schema = Joi.string().pattern(/^\+?(\d{9,15})$/); // Accepts phone numbers with 9 to 15 digits, with optional + for country code;
  const { error } = schema.validate(value.phoneNumber);
  return !value.requested || !error;
};


const invalidEmailValidation = value => {
  const schema = Joi.string().trim().email().allow('');
  const { error } = schema.validate(value.email);
  return !value.requested || !error;
};


module.exports = {
  emptyTelephoneValidation,
  invalidTelephoneValidation,
  emptyEmailValidation,
  invalidEmailValidation,
  optionSelected
};
