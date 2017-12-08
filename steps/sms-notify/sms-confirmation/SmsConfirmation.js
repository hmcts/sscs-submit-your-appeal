'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const regex = require('utils/regex');
const paths = require('paths');
const userAnswer = require('utils/answer');

class SmsConfirmation extends Question {

    static get path() {

        return paths.smsNotify.smsConfirmation;
    }

    get mobileNumber() {

        const isMobile = regex.internationalMobileNumber.test(this.fields.phoneNumber.value);

        if(isMobile) {
            return this.fields.useSameNumber.value === userAnswer.YES ?
                this.fields.phoneNumber.value : this.fields.enterMobile.value;
        }

        return this.fields.enterMobile.value;
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
                section: 'text-msg-reminders',
                answer: this.mobileNumber,
                url: paths.smsNotify.sendToNumber
            })
        ];
    }

    values() {

        let values = { smsNotify: {} };

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
