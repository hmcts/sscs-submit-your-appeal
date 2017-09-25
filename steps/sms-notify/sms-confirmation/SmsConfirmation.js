const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');

class SmsConfirmation extends Question {

    get url() {
        return '/sms-confirmation';
    }

    get template() {
        return 'sms-notify/sms-confirmation/template';
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
