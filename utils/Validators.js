const Joi = require('joi');

const regex = ( regex, content, allowEmpty = false ) => {

    let validator = Joi.string().regex(regex).error(new Error(content.error.msg));

    if(allowEmpty) {
        validator = validator.allow('');
    }

    return field => {

        const error = Joi.validate(field.value, validator).error;

        return error ? error.message : error;
    };

};

const email = ( content, allowEmpty = false) => {

    let validator = Joi.string().email({ minDomainAtoms: 2 }).error(new Error(content.error.msg));

    if (allowEmpty) {
        validator = validator.allow('');
    }

    return field => {

        const error = Joi.validate(field.value, validator).error;

        return error ? error.message : error;
    };

};

module.exports = { regex, email};
