'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { formatMobileNumber } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const regex = require('utils/regex');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SmsConfirmation extends Question {

    static get path() {

        return paths.smsNotify.smsConfirmation;
    }

    get mobileNumber() {

        const isMobile = regex.internationalMobileNumber.test(this.fields.phoneNumber.value);
        let number;

        if(isMobile) {
            number =  this.fields.useSameNumber.value === userAnswer.YES ?
                this.fields.phoneNumber.value : this.fields.enterMobile.value;
        } else {
            number = this.fields.enterMobile.value
        }

        return formatMobileNumber(number);
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.EnterMobile, 'enterMobile'),
            textField.ref(this.journey.steps.SendToNumber, 'useSameNumber'),
            textField.ref(this.journey.steps.AppellantContactDetails, 'phoneNumber')
        )
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.mobileNumber.question,
                section: sections.textMsgReminders,
                answer: this.mobileNumber,
                url: paths.smsNotify.sendToNumber
            })
        ];
    }

    values() {

        const values = { smsNotify: {} };

        values.smsNotify.useSameNumber = this.fields.useSameNumber.value === userAnswer.YES;
        values.smsNotify.smsNumber = values.smsNotify.useSameNumber ?
            this.fields.phoneNumber.value : this.fields.enterMobile.value;

        return values;
    }

    next() {

        return goTo(this.journey.steps.Representative);
    }
}

module.exports = SmsConfirmation;
