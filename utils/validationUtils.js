const Joi = require('joi');

const joiValidation = (value, joiSchema) => {
  let res;
  if (joiSchema && typeof joiSchema.validate === 'function') {
    res = joiSchema.validate(value);
  } else {
    const compiled = Joi.compile(joiSchema);
    res = compiled.validate(value);
  }
  return !res.error;
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
