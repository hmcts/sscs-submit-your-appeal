'use strict';

const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { postCode, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

const emailOptions = { minDomainAtoms: 2 };

class RepresentativeDetails extends Question {

    get url() {
        return urls.representative.representativeDetails;
    }

    get form() {
        const fields = this.content.fields;

        return form(
            field('firstName')
                .joi(fields.firstName.error.required, Joi.string().required())
                .joi(fields.firstName.error.invalid, Joi.string().regex(firstName)),

            field('lastName')
                .joi(fields.lastName.error.required, Joi.string().required())
                .joi(fields.lastName.error.invalid, Joi.string().regex(lastName)),
            field('organisation'),

            field('addressLine1')
                .joi(fields.addressLine1.error.required, Joi.string().regex(whitelist).required()),

            field('addressLine2'),

            field('townCity')
                .joi(fields.townCity.error.required, Joi.string().regex(whitelist).required()),

            field('county')
                .joi(fields.county.error.required, Joi.string().regex(whitelist).required()),

            field('postCode')
                .joi(fields.postCode.error.required, Joi.string().regex(postCode).required()),

            field('phoneNumber')
                .joi(fields.phoneNumber.error.invalid, Joi.string().regex(phoneNumber).allow('')),

            field('emailAddress')
                .joi(fields.emailAddress.error.invalid, Joi.string().email(emailOptions).allow('')),
        );
    }

    next() {
        return goTo(this.journey.ReasonForAppealing);
    }
}

module.exports = RepresentativeDetails;
