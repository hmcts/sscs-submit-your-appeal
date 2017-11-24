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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.mobileNumber.question,
                section: 'text-msg-reminders',
                answer: this.mobileNumber
            })
        ];
    }

    get form() {

        return form(

            textField.ref(this.journey.EnterMobile, 'enterMobile'),
            textField.ref(this.journey.SendToNumber, 'useSameNumber'),
            textField.ref(this.journey.AppellantContactDetails, 'phoneNumber')
        )
    }

    next() {

        return goTo(this.journey.Representative);
    }
}

module.exports = SmsConfirmation;
