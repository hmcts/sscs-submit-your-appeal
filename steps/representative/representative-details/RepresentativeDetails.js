'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
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

            textField('firstName')
                .joi(fields.firstName.error.required,
                Joi.string().required())
                .joi(fields.firstName.error.invalid,
                Joi.string().regex(firstName)
            ),

            textField('lastName')
                .joi(fields.lastName.error.required,
                Joi.string().required())
                .joi(fields.lastName.error.invalid,
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
                fields.county.error.invalid,
                Joi.string().regex(whitelist).allow('')
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
                question: this.content.cya.firstName.question,
                section: 'representative',
                answer: this.fields.firstName.value
            }),

            answer(this, {
                question: this.content.cya.lastName.question,
                section: 'representative',
                answer: this.fields.lastName.value
            }),

            answer(this, {
                question: this.content.cya.organisation.question,
                section: 'representative',
                answer: this.fields.organisation.value
            }),

            answer(this, {
                question: this.content.cya.addressLine1.question,
                section: 'representative',
                answer: this.fields.addressLine1.value
            }),

            answer(this, {
                question: this.content.cya.addressLine2.question,
                section: 'representative',
                answer: this.fields.addressLine2.value
            }),

            answer(this, {
                question: this.content.cya.townCity.question,
                section: 'representative',
                answer: this.fields.townCity.value
            }),

            answer(this, {
                question: this.content.cya.postCode.question,
                section: 'representative',
                answer: this.fields.postCode.value
            }),

            answer(this, {
                question: this.content.cya.phoneNumber.question,
                section: 'representative',
                answer: this.fields.phoneNumber.value
            }),

            answer(this, {
                question: this.content.cya.emailAddress.question,
                section: 'representative',
                answer: this.fields.emailAddress.value
            })
        ];
    }

    next() {

        return goTo(this.journey.ReasonForAppealing);
    }
}

module.exports = RepresentativeDetails;
