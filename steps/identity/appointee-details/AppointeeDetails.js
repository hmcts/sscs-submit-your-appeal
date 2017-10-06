const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class AppointeeDetails extends Question {

    get url() {
        return urls.identity.enterAppointeeDetails;
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
