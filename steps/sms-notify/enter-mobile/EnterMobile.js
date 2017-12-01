'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { internationalMobileNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class EnterMobile extends Question {

    static get path() {

        return paths.smsNotify.enterMobile;
    }

    get form() {

        return form(

            textField('enterMobile').joi(
                this.content.fields.enterMobile.error.emptyField,
                Joi.string().required()).joi(
                this.content.fields.enterMobile.error.invalidNumber,
                Joi.string().regex(internationalMobileNumber).required()
            )
        );
    }

    answers() {

        return [];
    }

    next() {
        return goTo(this.journey.steps.SmsConfirmation);
    }
}

module.exports = EnterMobile;
