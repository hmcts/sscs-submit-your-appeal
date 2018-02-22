'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const regex = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class TextReminders extends Question {

    static get path() {

        return paths.smsNotify.appellantTextReminders
    }

    get form() {

        return form(

            textField('doYouWantTextMsgReminders').joi(
                this.content.fields.doYouWantTextMsgReminders.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            ),

            textField.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber')
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.doYouWantTextMsgReminders.question,
                section: sections.textMsgReminders,
                answer: titleise(this.fields.doYouWantTextMsgReminders.value)
            })
        ];
    }

    values() {

        return {
            smsNotify: {
                wantsSMSNotifications: this.fields.doYouWantTextMsgReminders.value === userAnswer.YES
            }
        };
    }

    next() {

        const wantsTextMsgReminders = this.fields.doYouWantTextMsgReminders.value === userAnswer.YES;
        const nextStep = regex.mobileNumber.test(this.fields.phoneNumber.value) ?
            this.journey.steps.SendToNumber : this.journey.steps.EnterMobile;

        return branch(
            goTo(nextStep).if(wantsTextMsgReminders),
            goTo(this.journey.steps.Representative)
        );
    }
}

module.exports = TextReminders;
