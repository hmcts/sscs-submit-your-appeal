const { Question, form } = require('@hmcts/one-per-page');
const urls = require('urls');

class HearingArrangements extends Question {

    get url() {
        return urls.hearing.hearingArrangements;
    }

    get form() {

        return form();
    }

    next() {
    }
}

module.exports = HearingArrangements;
