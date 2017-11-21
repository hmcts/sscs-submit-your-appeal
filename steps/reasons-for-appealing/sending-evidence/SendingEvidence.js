'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class SendingEvidence extends Question {

    get url() {

        return paths.reasonsForAppealing.sendingEvidence;
    }

    get form() {

        return form();
    }

    next() {

        return goTo(this.journey.TheHearing);
    }
}

module.exports = SendingEvidence;
