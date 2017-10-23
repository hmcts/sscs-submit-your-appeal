'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class NoRepresentativeDetails extends Question {

    get url() {
        return paths.representative.noRepresentativeDetails;
    }

    get form() {}

    next() {
        return goTo(this.journey.ReasonForAppealing);
    }
}

module.exports = NoRepresentativeDetails;
