const Joi = require('joi');
const { get } = require('lodash');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { phoneNumber } = require('utils/regex');

const customJoi = Joi.extend(joi => {
  return {
    base: joi.string(),
    name: 'string',
    rules: [
      {
        name: 'validatePostcode',
        params: {
          invalidPostcode: joi.alternatives([
            joi.boolean().required(),
            joi.func().ref()
          ])
        },
        validate(params, value, state, options) {
          if (params.invalidPostcode) {
            return this.createError(
              'string.validatePostcode',
              { v: value },
              state,
              options
            );
          }

          return value;
        }
      },
      {
        name: 'validatePhone',
        params: { options: Joi.object({ phoneType: Joi.string() }) },
        validate(params, value, state, options) {
          const parsedPhoneNumber = parsePhoneNumberFromString(value, 'GB');
          const { phoneType } = get(params, 'options', {});
          let isValidPhone = false;
          const matchesRegex = phoneNumber.test(value);
          // If no phone-like structure comes of the parsing, a non-object is returned
          // so we need to explicitely check for the presence of the `isvalid` method
          if (parsedPhoneNumber && parsedPhoneNumber.isValid) {
            isValidPhone = parsedPhoneNumber.isValid();
            if (isValidPhone && phoneType) {
              isValidPhone = phoneType === parsedPhoneNumber.getType();
            }
          }

          if (!isValidPhone || !matchesRegex) {
            return this.createError(
              'string.validatePhone',
              { v: value },
              state,
              options
            );
          }

          return value;
        }
      }
    ]
  };
});

module.exports = customJoi;
