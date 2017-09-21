const { Question, goTo } = require('@hmcts/one-per-page');
// const content = require('./content');

class EnterMobile extends Question {

    get url() {
        return '/enter-mobile';
    }

    get template() {
        return `sms-notify/enter-mobile/template`;
    }

    // get i18NextContent() {
    //     return content;
    // }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = EnterMobile;
