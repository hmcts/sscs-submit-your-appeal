const { Question } = require('@hmcts/one-per-page');
const urls = require('urls');

class ReasonForAppealing extends Question {

    get url() {
        return urls.reasonsForAppealing.reasonForAppealing;
    }

    get form() {}

    next() {}
}

module.exports = ReasonForAppealing;
