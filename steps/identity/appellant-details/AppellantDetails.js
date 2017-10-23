'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { postCode, niNumber, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');
const emailOptions = require('utils/emailOptions');

class AppellantDetails extends Question {

    get url() {
        return paths.identity.enterAppellantDetails;
    }

    get isAppointee() {
        return this.fields.appointee.value === answer.YES;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            textField('firstName').joi(
                fields.firstName.error.required,
                Joi.string().regex(firstName).required()
            ),

            textField('lastName').joi(
                fields.lastName.error.required,
                Joi.string().regex(lastName).required()
            ),

            textField('niNumber').joi(
                fields.niNumber.error.required,
                Joi.string().regex(niNumber).required()
            ),

            textField('addressLine1').joi(
                fields.addressLine1.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('addressLine2').joi(
                fields.addressLine2.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('townCity').joi(
                fields.townCity.error.required,
                Joi.string().regex(whitelist).required()
            ),

            textField('postCode').joi(
                fields.postCode.error.required,
                Joi.string().regex(postCode).required()
            ),

            textField('appellantPhoneNumber').joi(
                fields.appellantPhoneNumber.error.invalid,
                Joi.string().regex(phoneNumber).allow('')
            ),

            textField('emailAddress').joi(
                fields.emailAddress.error.invalid,
                Joi.string().email(emailOptions).allow('')
            ),

            textField.ref(this.journey.Appointee, 'appointee')
        );
    }

    next() {
        return goTo(this.journey.TextReminders);
    }
}

module.exports = AppellantDetails;
