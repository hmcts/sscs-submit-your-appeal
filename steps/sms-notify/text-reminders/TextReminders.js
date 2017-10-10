const { Question, goTo } = require('@hmcts/one-per-page');
const regex = require('../../../utils/regex');
const urls = require('urls');

class TextReminders extends Question {

    get url() {
        return urls.smsNotify.appellantTextReminders
    }

    get template() {
        // if the appellant details phone number is a mobile set to true
        const number = this.locals.session.AppellantDetails_phoneNumber;
        this.locals.isAppellantNumberMobile = number.match(regex.mobileNumber);
        return `sms-notify/text-reminders/template`;
    }

    get form() {}

    next() {
        return goTo(this.journey.EnterMobile);
    }
}

module.exports = TextReminders;
