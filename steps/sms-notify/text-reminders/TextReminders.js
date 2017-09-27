const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');
const regex = require('../../../utils/regex');

class TextReminders extends Question {

    get url() {
        return '/appellant-text-reminders';
    }

    get template() {
        // if the appellant details phone number is a mobile set to true
        const number = this.locals.session.AppellantDetails_phoneNumber;
        this.locals.isAppellantNumberMobile = number.match(regex.mobileNumber);
        return `sms-notify/text-reminders/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {}

    next() {
        return goTo(this.journey.EnterMobile);
    }
}

module.exports = TextReminders;
