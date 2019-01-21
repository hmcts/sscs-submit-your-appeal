const Joi = require('joi');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const customJoi = Joi.extend(joi => {
  return {
    base: joi.string(),
    name: 'string',
    rules: [
      {
        name: 'validatePostcode',
        params: {
          invalidPostcode: joi.alternatives([joi.boolean().required(), joi.func().ref()])
        },
        validate(params, value, state, options) {
          if (params.invalidPostcode) {
            return this.createError('string.validatePostcode', { v: value }, state, options);
          }

          return value;
        }
      },
      {
        name: 'validatePhone',
        validate(params, value, state, options) {
          const parsedPhoneNumber = parsePhoneNumberFromString(value, 'GB');
          let isValidPhone = false;
          if (parsedPhoneNumber && parsedPhoneNumber.isValid) {
            isValidPhone = parsedPhoneNumber.isValid();
          }

          if (!isValidPhone) {
            return this.createError('string.validatePhone', { v: value }, state, options);
          }

          return value;
        }
      }
    ]
  };
});

module.exports = customJoi;
