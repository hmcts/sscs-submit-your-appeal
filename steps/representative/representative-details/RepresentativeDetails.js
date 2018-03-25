'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { postCode, firstName, lastName, whitelist, phoneNumber } = require('utils/regex');
const { formatMobileNumber } = require('utils/stringUtils');
const { isNotEmptyString, regexValidation } = require('utils/validationUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const emailOptions = require('utils/emailOptions');
const userAnswer = require('utils/answer');

class RepresentativeDetails extends Question {

    static get path() {

        return paths.representative.representativeDetails;
    }

    get CYAOrganisation() {

        return this.fields.organisation.value || userAnswer.NOT_PROVIDED;
    }

    get CYAPhoneNumber() {

        return this.fields.phoneNumber.value ? formatMobileNumber(this.fields.phoneNumber.value) : userAnswer.NOT_PROVIDED;
    }

    get CYAEmailAddress() {

        return this.fields.emailAddress.value || userAnswer.NOT_PROVIDED;
    }

    get form() {

        const fields = this.content.fields;

        return form({

            blah: object({
                firstName: text,
                lastName: text,
                organisation: text
            }).check(
                errorFor('firstName', fields.firstName.error.required),
                value => isNotEmptyString(value.firstName)
            ).check(
                errorFor('firstName', fields.firstName.error.invalid),
                value => regexValidation(value.firstName)
            ),

            // firstName: text
            //     .joi(
            //         fields.firstName.error.required,
            //         Joi.string().required()
            //     ).joi(
            //         fields.firstName.error.invalid,
            //         Joi.string().trim().regex(firstName)
            //     ),
            // lastName: text
            //     .joi(
            //         fields.lastName.error.required,
            //         Joi.string().required()
            //     ).joi(
            //         fields.lastName.error.invalid,
            //         Joi.string().trim().regex(lastName)
            //     ),
            // organisation: text
            //     .joi(
            //         fields.organisation.error.invalid,
            //         Joi.string().regex(whitelist).allow('')
            //     ),
            addressLine1: text
                .joi(
                    fields.addressLine1.error.required,
                    Joi.string().regex(whitelist).required()
                ),
            addressLine2: text
                .joi(
                    fields.addressLine2.error.invalid,
                    Joi.string().regex(whitelist).allow('')
                ),
            townCity: text
                .joi(
                    fields.townCity.error.required,
                    Joi.string().regex(whitelist).required()
                ),
            county: text
                .joi(
                    fields.county.error.required,
                    Joi.string().regex(whitelist).required()
                ),
            postCode: text
                .joi(
                    fields.postCode.error.required,
                    Joi.string().trim().regex(postCode).required()
                ),
            emailAddress: text
                .joi(
                    fields.emailAddress.error.invalid,
                    Joi.string().trim().email(emailOptions).allow('')
                ),
            phoneNumber: text
                .joi(
                    fields.phoneNumber.error.invalid,
                    Joi.string().regex(phoneNumber).allow('')
                )
        });
    }

    answers() {

        return [

            answer(this, {
                section: sections.representative,
                template: 'answer.html'
            })
        ];
    }

    values() {

        return {
            representative: {
                firstName: this.fields.firstName.value,
                lastName: this.fields.lastName.value,
                organisation: this.fields.organisation.value,
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
        }
    }

    next() {

        return goTo(this.journey.steps.ReasonForAppealing);
    }
}

module.exports = RepresentativeDetails;
