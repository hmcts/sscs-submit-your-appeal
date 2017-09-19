const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');

class AppellantSMSNotify extends Question {

    get url() {
        return '/appellant-sms-notify';
    }

    get template() {
        return `sms-notify/appellant/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = AppellantSMSNotify;
