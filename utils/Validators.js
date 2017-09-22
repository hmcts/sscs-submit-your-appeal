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

const multiRegex = (validationList, content) => {

    let validators = [];

    validationList.forEach(validation => {
        validators.push(Joi.string().regex(validation.regex).error(new Error(content.error[validation.msg])))
    });

    return field => {
        let error = [];

        validators.forEach(validator => {
            const joiError = Joi.validate(field.value, validator).error;
            if (joiError) error.push(joiError);
        });

        return error.length > 0 ? error[0].message : null;
    }
};

module.exports = { regex, email, multiRegex };
