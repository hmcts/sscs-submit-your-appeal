'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const regex = require('../../../utils/regex');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class TextReminders extends Question {

    get url() {

        return paths.smsNotify.appellantTextReminders
    }

    get form() {

        return form(

            textField('doYouWantTextMsgReminders').joi(
                this.content.fields.doYouWantTextMsgReminders.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO])
            ),

            textField.ref(this.journey.AppellantContactDetails, 'phoneNumber')
        );
    }

    next() {

        const wantsTextMsgReminders = () => this.fields.doYouWantTextMsgReminders.value === userAnswer.YES;
        const nextStep = regex.mobileNumber.test(this.fields.phoneNumber.value) ? this.journey.SendToNumber : this.journey.EnterMobile;

        return branch(
            goTo(nextStep).if(wantsTextMsgReminders),
            goTo(this.journey.Representative)
        );
    }
}

module.exports = TextReminders;
