const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');

class TextReminders extends Question {

    get url() {
        return '/appellant-text-reminders';
    }

    get template() {
        return `sms-notify/text-reminders/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = TextReminders;
