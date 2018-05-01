const Joi = require('joi');

const joiValidation = (value, joiSchema) => {
  const valid = Joi.validate(value, joiSchema);
  return valid.error === null;
};

module.exports = { joiValidation };
