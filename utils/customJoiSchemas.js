const Joi = require('joi');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { phoneNumber } = require('utils/regex');

const customJoi = Joi.extend(joi => {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.validatePostcode': '{{#v}} is an invalid postcode',
      'string.validatePhone': '{{#v}} is an invalid phone number'
    },
    rules: {
      validatePostcode: {
        method(invalidPostcode) {
          return this.$_addRule({
            name: 'validatePostcode',
            args: { invalidPostcode }
          });
        },
        validate(value, helpers, args) {
          if (args.invalidPostcode) {
            return helpers.error('string.validatePostcode', { v: value });
          }
          return value; // Valid postcode
        }
      },
      validatePhone: {
        method(options = {}) {
          return this.$_addRule({
            name: 'validatePhone',
            args: { options }
          });
        },
        validate(value, helpers, { options }) {
          const parsedPhoneNumber = parsePhoneNumberFromString(value, 'GB');
          const { phoneType } = options;
          let isValidPhone = false;
          const matchesRegex = phoneNumber.test(value);

          if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
            isValidPhone = parsedPhoneNumber.isValid();
            if (isValidPhone && phoneType) {
              isValidPhone = phoneType === parsedPhoneNumber.getType();
            }
          }

          if (!isValidPhone || !matchesRegex) {
            return helpers.error('string.validatePhone', { v: value });
          }

          return value; // Valid phone number
        }
      }
    }
  };
});

module.exports = customJoi;
