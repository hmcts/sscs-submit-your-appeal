const customJoi = require('utils/customJoiSchemas');
const Joi = require('joi');
const emailOptions = require('utils/emailOptions');

const emptyTelephoneValidation = (value) =>
  !(value.requested && !value.phoneNumber);
const emptyEmailValidation = (value) => !(value.requested && !value.email);
const optionSelected = (options) => {
  const optionValues = Object.values(options);
  let valueSet = false;

  optionValues.forEach((option) => {
    valueSet = valueSet ? valueSet : option.requested;
  });

  return valueSet;
};

const invalidTelephoneValidation = (value) => {
  const { error } = Joi.validate(
    value.phoneNumber,
    customJoi.string().trim().validatePhone()
  );
  return !value.requested || !error;
};

const invalidEmailValidation = (value) => {
  const { error } = Joi.validate(
    value.email,
    Joi.string().trim().email(emailOptions).allow('')
  );
  return !value.requested || !error;
};

module.exports = {
  emptyTelephoneValidation,
  invalidTelephoneValidation,
  emptyEmailValidation,
  invalidEmailValidation,
  optionSelected
};
