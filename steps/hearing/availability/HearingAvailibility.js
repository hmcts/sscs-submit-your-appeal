'use strict';

const { Question } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
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
