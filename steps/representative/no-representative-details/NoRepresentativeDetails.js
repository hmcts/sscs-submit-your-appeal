'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class NoRepresentativeDetails extends Question {

    static get path() {

        return paths.representative.noRepresentativeDetails;
    }

    get form() {

        return form();
    }

    answers() {

        return [];
    }

    next() {

        return goTo(this.journey.steps.ReasonForAppealing);
    }
}

module.exports = NoRepresentativeDetails;
