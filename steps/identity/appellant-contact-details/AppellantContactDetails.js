'use strict';

const { Question, goTo} = require('@hmcts/one-per-page');
const paths = require('paths');

class AppellantContactDetails extends Question {

    get url() {
        return paths.identity.enterAppellantContactDetails;
    }

    get form() {}

    next() {
        return goTo(undefined);
    }
}

module.exports = AppellantContactDetails;
