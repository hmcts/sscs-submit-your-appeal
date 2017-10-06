const { Question, form } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class HearingAvailibility extends Question {

    get url() {
        return urls.hearing.hearingAvailability;
    }

    get form() {

        return form();
    }

    get template() {
        return `hearing/hearing-arrangements/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
    }
}

module.exports = HearingAvailibility;
