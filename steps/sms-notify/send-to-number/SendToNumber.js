'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SendToNumber extends Question {

    static get path() {

        return paths.smsNotify.sendToNumber;
    }

    get phoneNumber() {

        return this.fields.phoneNumber.value;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber'),

            textField('useSameNumber').joi(
                this.content.fields.useSameNumber.error.required,
                Joi.string().regex(whitelist).required()
            )
        );
    }

    answers() {

        return answer(this, { hide: true });
    }

    values() {

        return {
            smsNotify: {
                useSameNumber: this.fields.useSameNumber.value === userAnswer.YES
            }
        };
    }

    next() {

        const useSameNumber = () => this.fields.useSameNumber.value === userAnswer.YES;

        return branch(
            goTo(this.journey.steps.SmsConfirmation).if(useSameNumber),
            goTo(this.journey.steps.EnterMobile)
        );
    }
}

module.exports = SendToNumber;
