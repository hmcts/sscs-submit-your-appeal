'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class SendingEvidence extends Question {

    static get path() {

        return paths.reasonsForAppealing.sendingEvidence;
    }

    get form() {

        return form();
    }

    answers() {

        return [];
    }

    next() {

        return goTo(this.journey.steps.TheHearing);
    }
}

module.exports = SendingEvidence;
