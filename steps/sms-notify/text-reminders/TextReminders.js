const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class TextReminders extends Question {

    get url() {
        return urls.smsNotify.appellantTextReminders
    }

    get form() {}

    next() {
        return goTo(this.journey.EnterMobile);
    }
}

module.exports = TextReminders;
