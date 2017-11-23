'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');

class SendToNumber extends Question {

    get url() {

        return paths.smsNotify.sendToNumber;
    }

    get phoneNumber() {

        return this.fields.phoneNumber.value;
    }

    get form() {

        return form(

            textField.ref(this.journey.AppellantContactDetails, 'phoneNumber'),

            textField('useSameNumber').joi(
                this.content.fields.useSameNumber.error.required,
                Joi.string().regex(whitelist).required()
            )
        );
    }

    answers() {

        return [];
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
