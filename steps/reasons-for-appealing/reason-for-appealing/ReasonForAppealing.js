'use strict';

const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');

class ReasonForAppealing extends Question {

    get url() {
        return paths.reasonsForAppealing.reasonForAppealing;
    }

    get form() {}

    next() {}
}

module.exports = ReasonForAppealing;
