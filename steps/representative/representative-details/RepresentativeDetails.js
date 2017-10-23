'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { postCode, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');

class RepresentativeDetails extends Question {

    get url() {
        return paths.representative.representativeDetails;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            textField('firstName').joi(
                fields.firstName.error.required,
                Joi.string().required()
            ).joi(
                fields.firstName.error.invalid,
                Joi.string().regex(firstName)
            ),

            textField('lastName').joi(
                fields.lastName.error.required,
                Joi.string().required()
            ).joi(
                fields.lastName.error.invalid,
                Joi.string().regex(lastName)
            ),

            textField('organisation').joi(
                fields.organisation.error.invalid,
                Joi.string().regex(whitelist).allow('')
            ),

            textField('addressLine1').joi(
                fields.addressLine1.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('addressLine2').joi(
                fields.addressLine2.error.invalid,
                Joi.string().regex(whitelist).allow('')
            ),

            textField('townCity').joi(
                fields.townCity.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('county').joi(
                fields.county.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('postCode').joi(
                fields.postCode.error.required,
                Joi.string().regex(postCode).required()
            ),

            textField('phoneNumber').joi(
                fields.phoneNumber.error.invalid,
                Joi.string().regex(phoneNumber).allow('')
            ),

            textField('emailAddress').joi(
                fields.emailAddress.error.invalid,
                Joi.string().email(emailOptions).allow('')
            )
        );
    }

    next() {
        return goTo(this.journey.ReasonForAppealing);
    }
}

module.exports = RepresentativeDetails;
