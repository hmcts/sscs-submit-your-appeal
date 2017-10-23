'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { internationalMobileNumber } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

class EnterMobile extends Question {

    get url() {
        return urls.smsNotify.enterMobile;
    }

    get form() {

        return form(

            textField('enterMobile').joi(
                this.content.fields.enterMobile.error.emptyField,
                Joi.string().required())
            .joi(
                this.content.fields.enterMobile.error.invalidNumber,
                Joi.string().regex(internationalMobileNumber).required()
            )
        );
    }

    next() {
        return goTo(this.journey.SmsConfirmation);
    }
}

module.exports = EnterMobile;
