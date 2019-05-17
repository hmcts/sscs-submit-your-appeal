const Joi = require('joi');

const postcodeLookupJoi = Joi.extend(joi => {
  return {
    base: joi.string(),
    name: 'string',
    rules: [
      {
        name: 'validateAddressList',
        params: {
          req: joi.object()
        },
        validate(params, value, state, options) {
          const req = params.req;
          if (req.body.submitType === 'lookup' ||
             (req.session.addressSuggestions && req.session.addressSuggestions.length > 0)) {
            return value;
          }
          return this.createError('string.validatePostcodeLookup', { v: value }, state, options);
        }
      }
    ]
  };
});

module.exports = postcodeLookupJoi;
