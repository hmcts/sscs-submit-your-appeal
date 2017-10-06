const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class SmsConfirmation extends Question {

    get url() {
        return urls.smsNotify.smsConfirmation;
    }

    get i18NextContent() {
        return content;
    }

    get form() {}

    next() {
        return goTo(this.journey.Representative);
    }
}

module.exports = SmsConfirmation;
