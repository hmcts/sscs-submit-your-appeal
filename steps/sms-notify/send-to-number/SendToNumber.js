const { Question, goTo } = require('@hmcts/one-per-page');
// const content = require('./content');

class SendToNumber extends Question {

    get url() {
        return '/send-to-number';
    }

    get template() {
        return `sms-notify/send-to-number/template`;
    }

    // get i18NextContent() {
    //     return content;
    // }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = SendToNumber;
