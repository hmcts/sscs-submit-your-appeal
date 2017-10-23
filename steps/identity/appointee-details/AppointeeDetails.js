'use strict';

const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppointeeDetails extends Question {

    get url() {
        return paths.identity.enterAppointeeDetails;
    }

    get form() {}

    next() {}
}

module.exports = AppointeeDetails;
