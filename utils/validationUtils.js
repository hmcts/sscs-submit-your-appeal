const Joi = require('joi');

const isNotEmptyString = value => {
    return value !== undefined || value !== '';
};

const regexValidation = (value, regex) => {

    const a = Joi.string().trim().regex(value);
    console.log(a)
    return false;
};

module.exports = {
  isNotEmptyString,
    regexValidation
};
