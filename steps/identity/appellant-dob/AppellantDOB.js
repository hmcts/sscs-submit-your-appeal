'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppellantDOB extends Question {

    get url() {
        return paths.identity.enterAppellantDOB;
    }

    get form() {}

    next() {
        return goTo(undefined);
    }
}

module.exports = AppellantDOB;
