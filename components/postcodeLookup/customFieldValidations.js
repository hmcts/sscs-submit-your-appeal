const Joi = require('joi');

const postcodeLookupJoi = Joi.extend(joi => {
  return {
    base: joi.string(),
    name: 'string',
    rules: [
      {
        name: 'validateAddressList',
        params: {
          page: joi.object()
        },
        validate(params, value, state, options) {
          const page = params.page;
          if (page.req.body.submitType === 'lookup' ||
              page.req.method === 'GET' ||
             (page.addressSuggestions && page.addressSuggestions.length > 0)) {
            return value;
          }
          return this.createError('string.validatePostcodeLookup', { v: value }, state, options);
        }
      }
    ]
  };
});

module.exports = postcodeLookupJoi;
