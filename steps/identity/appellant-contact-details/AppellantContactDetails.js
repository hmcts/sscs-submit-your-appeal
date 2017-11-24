'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode, whitelist, phoneNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');

class AppellantContactDetails extends Question {

    static get path() {

        return paths.identity.enterAppellantContactDetails;
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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.addressLine1.question,
                section: 'appellant-details',
                answer: this.fields.addressLine1.value
            }),

            answer(this, {
                question: this.content.cya.addressLine2.question,
                section: 'appellant-details',
                answer: this.fields.addressLine2.value
            }),

            answer(this, {
                question: this.content.cya.townCity.question,
                section: 'appellant-details',
                answer: this.fields.townCity.value
            }),

            answer(this, {
                question: this.content.cya.postCode.question,
                section: 'appellant-details',
                answer: this.fields.postCode.value
            }),

            answer(this, {
                question: this.content.cya.phoneNumber.question,
                section: 'appellant-details',
                answer: this.fields.phoneNumber.value
            }),

            answer(this, {
                question: this.content.cya.emailAddress.question,
                section: 'appellant-details',
                answer: this.fields.emailAddress.value
            })
        ];
    }

    next() {

        return goTo(this.journey.TextReminders);
    }
}

module.exports = AppellantContactDetails;
