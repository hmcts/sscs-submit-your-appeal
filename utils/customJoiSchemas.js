const Joi = require('joi');
const { get } = require('lodash');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { phoneNumber } = require('utils/regex');

const customJoi = Joi.extend(joi => {
  return {
    base: joi.string(),
    type: 'string',
    rules: {
      validatePostcode: {
        method(invalidPostcode) {
          return this.$_addRule({
            name: 'validatePostcode',
            args: { invalidPostcode }
          });
        },
        validate(value, helpers, args) {
          if (args && args.invalidPostcode) {
            return helpers.error('string.validatePostcode', { v: value });
          }
          return value;
        }
      },
      validatePhone: {
        method(options) {
          return this.$_addRule({ name: 'validatePhone', args: { options } });
        },
        validate(value, helpers, args) {
          const parsedPhoneNumber = parsePhoneNumberFromString(value, 'GB');
          const phoneType = get(args, 'options.phoneType');
          let isValidPhone = false;
          const matchesRegex = phoneNumber.test(value);

          if (parsedPhoneNumber && parsedPhoneNumber.isValid) {
            isValidPhone = parsedPhoneNumber.isValid();
            if (isValidPhone && phoneType) {
              isValidPhone = phoneType === parsedPhoneNumber.getType();
            }
          }

          if (!isValidPhone || !matchesRegex) {
            return helpers.error('string.validatePhone', { v: value });
          }

          return value;
        }
      }
    },
    messages: {
      'string.validatePostcode': '{{#label}} failed postcode validation',
      'string.validatePhone': '{{#label}} failed phone validation'
    }
  };
});

module.exports = customJoi;
