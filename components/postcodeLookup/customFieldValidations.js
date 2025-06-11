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
          const req = page.req;
          const requestType = req.body.submitType ? req.body.submitType : '';
          const method = req.method;
          if (
            requestType === 'lookup' ||
            requestType === 'addressSelection' ||
            method === 'GET' ||
            (page.fields.postcodeAddress &&
              page.fields.postcodeAddress.validate())
          ) {
            return value;
          }
          return this.createError(
            'string.validatePostcodeLookup',
            { v: value },
            state,
            options
          );
        }
      }
    ]
  };
});

module.exports = postcodeLookupJoi;
