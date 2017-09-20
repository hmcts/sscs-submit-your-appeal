const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');

class AppointeeDetails extends Question {

    get url() {
        return '/enter-appointee-details';
    }

    get template() {
        return `identity/appointee-details/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = AppointeeDetails;
