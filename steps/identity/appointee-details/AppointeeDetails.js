'use strict';

const { Question } = require('@hmcts/one-per-page');
const urls = require('urls');

class AppointeeDetails extends Question {

    get url() {
        return urls.identity.enterAppointeeDetails;
    }

    get form() {}

    next() {}
}

module.exports = AppointeeDetails;
