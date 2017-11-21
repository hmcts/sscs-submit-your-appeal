'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { postCode, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');

class AppellantContactDetails extends Question {

    get url() {

        return paths.identity.enterAppellantDetails;
    }

    get form() {

        const fields = this.content.fields;

        return form(

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

        return goTo(this.journey.TextReminders);
    }
}

module.exports = AppellantContactDetails;
