'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const regex = require('../../../utils/regex');
const urls = require('urls');

class TextReminders extends Question {

    get url() {
        return urls.smsNotify.appellantTextReminders
    }

    get signUpLink() {
        return regex.mobileNumber.test(this.fields.appellantPhoneNumber.value) ?
            urls.smsNotify.sendToNumber : urls.smsNotify.enterMobile
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
