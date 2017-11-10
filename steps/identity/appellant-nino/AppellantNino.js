'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppellantNINO extends Question {

    get url() {
        return paths.identity.enterAppellantNINO;
    }

    get form() {}

    next() {
        return goTo(undefined);
    }
}

module.exports = AppellantNINO;
