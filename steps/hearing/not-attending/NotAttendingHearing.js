'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class NotAttendingHearing extends Question {

    get url() {

        return paths.hearing.notAttendingHearing;
    }

    get form() {

        return form();
    }

    next() {

        return goTo(this.journey.CheckYourAppeal);
    }
}

module.exports = NotAttendingHearing;
