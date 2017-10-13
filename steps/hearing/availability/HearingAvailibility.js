const { Question, form } = require('@hmcts/one-per-page');
const urls = require('urls');

class HearingAvailibility extends Question {

    get url() {
        return urls.hearing.hearingAvailability;
    }

    get form() {

        return form();
    }

    next() {}
}

module.exports = HearingAvailibility;
