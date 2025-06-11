const Joi = require('joi');

const joiValidation = (value, joiSchema) => {
  const valid = Joi.validate(value, joiSchema);
  return valid.error === null;
};

const hasNameButNoTitleValidation = value =>
  !((value.first && !value.title) || (value.last && !value.title));

const hasTitleButNoNameValidation = value =>
  !(value.title && !(value.first || value.last));

module.exports = {
  joiValidation,
  hasNameButNoTitleValidation,
  hasTitleButNoNameValidation
};
