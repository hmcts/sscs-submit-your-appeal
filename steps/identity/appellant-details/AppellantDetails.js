const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { postCode, niNumber, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

const emailOptions = { minDomainAtoms: 2 };

class AppellantDetails extends Question {

    get url() {
        return urls.identity.enterAppellantDetails;
    }

    get i18NextContent() {
        return content;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            field('firstName')
                .joi(fields.firstName.error.required, Joi.string().regex(firstName).required()),

            field('lastName')
                .joi(fields.lastName.error.required, Joi.string().regex(lastName).required()),

            field('niNumber')
                .joi(fields.niNumber.error.required, Joi.string().regex(niNumber).required()),

            field('addressLine1')
                .joi(fields.addressLine1.error.required, Joi.string().regex(whitelist).required()),

            field('addressLine2')
                .joi(fields.addressLine2.error.required, Joi.string().regex(whitelist).required()),

            field('townCity')
                .joi(fields.townCity.error.required, Joi.string().regex(whitelist).required()),

            field('postCode')
                .joi(fields.postCode.error.required, Joi.string().regex(postCode).required()),

            field('phoneNumber')
                .joi(fields.phoneNumber.error.invalid, Joi.string().regex(phoneNumber).allow('')),

            field('emailAddress')
                .joi(fields.emailAddress.error.invalid, Joi.string().email(emailOptions).allow('')),
        );
    }

    next() {
        return goTo(this.journey.TextReminders);
    }
}

module.exports = AppellantDetails;
