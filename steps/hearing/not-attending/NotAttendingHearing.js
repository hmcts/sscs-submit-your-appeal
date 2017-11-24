'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class NotAttendingHearing extends Question {

    static get path() {

        return paths.hearing.notAttendingHearing;
    }

    get form() {

        return form();
    }

    answers() {

        return [];
    }

    next() {

        return goTo(this.journey.CheckYourAppeal);
    }
}

module.exports = NotAttendingHearing;
