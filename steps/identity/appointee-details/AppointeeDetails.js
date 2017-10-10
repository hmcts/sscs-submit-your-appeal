const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class AppointeeDetails extends Question {

    get url() {
        return urls.identity.enterAppointeeDetails;
    }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = AppointeeDetails;
