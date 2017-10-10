const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class SmsConfirmation extends Question {

    get url() {
        return urls.smsNotify.smsConfirmation;
    }

    get form() {}

    next() {
        return goTo(this.journey.Representative);
    }
}

module.exports = SmsConfirmation;
