'use strict';

const { Question } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class HearingAvailibility extends Question {

    get url() {
        return paths.hearing.hearingAvailability;
    }

    get form() {
        return form();
    }

    next() {}
}

module.exports = HearingAvailibility;
