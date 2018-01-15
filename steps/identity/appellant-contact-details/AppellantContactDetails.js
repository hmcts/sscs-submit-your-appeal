'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode, whitelist, phoneNumber } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');

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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.addressLine1.question,
                section: sections.appellantDetails,
                answer: this.fields.addressLine1.value
            }),

            answer(this, {
                question: this.content.cya.addressLine2.question,
                section: sections.appellantDetails,
                answer: this.fields.addressLine2.value || userAnswer.NOT_PROVIDED
            }),

            answer(this, {
                question: this.content.cya.townCity.question,
                section: sections.appellantDetails,
                answer: this.fields.townCity.value
            }),

            answer(this, {
                question: this.content.cya.county.question,
                section: sections.appellantDetails,
                answer: this.fields.county.value
            }),

            answer(this, {
                question: this.content.cya.postCode.question,
                section: sections.appellantDetails,
                answer: this.fields.postCode.value
            }),

            answer(this, {
                question: this.content.cya.emailAddress.question,
                section: sections.appellantDetails,
                answer: this.fields.emailAddress.value || userAnswer.NOT_PROVIDED
            }),

            answer(this, {
                question: this.content.cya.phoneNumber.question,
                section: sections.appellantDetails,
                answer: this.fields.phoneNumber.value || userAnswer.NOT_PROVIDED
            }),
        ];
    }

    values() {

        return {
            appellant: {
                contactDetails: {
                    addressLine1: this.fields.addressLine1.value,
                    addressLine2: this.fields.addressLine2.value,
                    townCity: this.fields.townCity.value,
                    county: this.fields.county.value,
                    postCode: this.fields.postCode.value,
                    phoneNumber: this.fields.phoneNumber.value,
                    emailAddress: this.fields.emailAddress.value,
                }
            }
        };
    }

    next() {

        return goTo(this.journey.steps.TextReminders);
    }
}

module.exports = AppellantContactDetails;
