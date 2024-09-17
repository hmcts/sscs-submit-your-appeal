/* eslint-disable no-undefined */
const joiValidation = (value, joiSchema) => {
  const valid = joiSchema.validate(value);
  return valid.error === undefined;
};

const hasNameButNoTitleValidation = value => !(
  (value.first && !value.title) || (value.last && !value.title)
);

const hasTitleButNoNameValidation = value => !(value.title && !(value.first || value.last));

module.exports = {
  joiValidation,
  hasNameButNoTitleValidation,
  hasTitleButNoNameValidation
};
