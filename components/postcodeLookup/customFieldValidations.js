const Joi = require('joi');

// Provide a small compatibility layer that matches the old API used by the app:
// customFieldValidations.string().validateAddressList(page) -> returns a Joi schema

function string() {
  return {
    validateAddressList: page => Joi.string().custom((value, helpers) => {
      try {
        const req = page.req;
        const requestType =
            req && req.body && req.body.submitType ? req.body.submitType : '';
        const method = req && req.method;

        // If any of the allowed conditions are true, accept the value
        if (
          requestType === 'lookup' ||
            requestType === 'addressSelection' ||
            method === 'GET' ||
            (page.fields &&
              page.fields.postcodeAddress &&
              page.fields.postcodeAddress.validate())
        ) {
          return value;
        }

        // Return an error (use generic invalid key)
        return helpers.error('any.invalid');
      } catch (err) {
        return helpers.error('any.invalid');
      }
    })
  };
}

module.exports = {
  string
};
