'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const regex = require('../../../utils/regex');
const paths = require('paths');

class TextReminders extends Question {

    get url() {
        return paths.smsNotify.appellantTextReminders
    }

    get signUpLink() {
        return regex.mobileNumber.test(this.fields.appellantPhoneNumber.value) ?
            paths.smsNotify.sendToNumber : paths.smsNotify.enterMobile
    }

    get form() {

        return form(

            textField.ref(this.journey.AppellantDetails, 'appellantPhoneNumber')
        )
    }

    next() {
        return goTo(this.journey.EnterMobile);
    }
}

module.exports = TextReminders;
