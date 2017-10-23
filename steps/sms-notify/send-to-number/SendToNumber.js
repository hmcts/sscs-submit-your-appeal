'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');
const answer = require('utils/answer');

class SendToNumber extends Question {

    get url() {
        return urls.smsNotify.sendToNumber;
    }

    get appellantPhoneNumber() {
        return this.fields.appellantPhoneNumber.value;
    }

    get form() {
        return form(
            textField.ref(this.journey.AppellantDetails, 'appellantPhoneNumber'),
            textField('useSameNumber').joi(
                this.content.fields.useSameNumber.error.required,
                Joi.string().regex(whitelist).required()
            )
        );
    }

    next() {

        const useSameNumber = () => this.fields.useSameNumber.value === answer.YES;

        return branch(
            goTo(this.journey.SmsConfirmation).if(useSameNumber),
            goTo(this.journey.EnterMobile)
        );
    }
}

module.exports = SendToNumber;
