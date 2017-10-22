const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const regex = require('../../../utils/regex');
const urls = require('urls');
const answer = require('utils/answer');

class SmsConfirmation extends Question {

    get url() {
        return urls.smsNotify.smsConfirmation;
    }

    get mobileNumber() {

        const isMobile = regex.internationalMobileNumber.test(this.fields.appellantPhoneNumber.value);

        if(isMobile) {
            return this.fields.useSameNumber.value === answer.YES ?
                this.fields.appellantPhoneNumber.value : this.fields.enterMobile.value;
        }

        return this.fields.enterMobile.value;
    }

    get form() {
        return form(
            textField.ref(this.journey.EnterMobile, 'enterMobile'),
            textField.ref(this.journey.SendToNumber, 'useSameNumber'),
            textField.ref(this.journey.AppellantDetails, 'appellantPhoneNumber')
        )
    }

    next() {
        return goTo(this.journey.Representative);
    }
}

module.exports = SmsConfirmation;
