const { reduce, isArray } = require('lodash');
const xssFilters = require('xss-filters');

const parse = (step, req) => {
  const { body, params, query } = req;

  return reduce((step && step.properties) || {}, (acc, v, k) => { // eslint-disable-line complexity
    switch (true) {
    case v.ignoreParser === 'true':
      break;

    case body.hasOwnProperty(k):

      acc[k] = body[k];
      break;

    case params && params.hasOwnProperty(k):

      acc[k] = params[k];
      break;

    case query && query.hasOwnProperty(k):

      acc[k] = query[k];
      break;

    default:

      //  if data has not been passed from post, that expects an array, create one
      if (req.method.toLowerCase() === 'post' && v.type === 'array') {
        acc[k] = [];
      }
    }

    if (typeof acc[k] !== 'undefined') {
      if (isArray(acc[k])) {
        acc[k] = acc[k].map(val => xssFilters.inHTMLData(val));
      } else {
        acc[k] = xssFilters.inHTMLData(acc[k]);
      }
    }

    if (v.type === 'number' && acc[k]) {
      acc[k] = parseFloat(acc[k]);
    }

    if (v.type === 'integer' && acc[k]) {
      acc[k] = parseInt(acc[k], 10);
    }

    if (typeof acc[k] === 'undefined') {
      delete acc[k];
    }

    return acc;
  }, {});
};

module.exports = { parse };
