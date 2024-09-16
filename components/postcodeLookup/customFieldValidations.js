const Joi = require('joi');

const postcodeLookupJoi = Joi.extend(joi => {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.validatePostcodeLookup': '{{#v}} is an invalid address lookup request'
    },
    rules: {
      validateAddressList: {
        method(page) {
          return this.$_addRule({
            name: 'validateAddressList',
            args: { page }
          });
        },
        validate(value, helpers, { page }) {
          const req = page.req;
          const requestType = req.body.submitType || '';
          const method = req.method;

          if (
            requestType === 'lookup' ||
          requestType === 'addressSelection' ||
          method === 'GET' ||
          (page.fields.postcodeAddress && page.fields.postcodeAddress.validate())
          ) {
            return value; // Address list validation is successful
          }

          return helpers.error('string.validatePostcodeLookup', { v: value });
        }
      }
    }
  };
});

module.exports = postcodeLookupJoi;
