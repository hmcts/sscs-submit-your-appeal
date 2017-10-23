'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class CheckYourAppeal extends Question {

    get url() {
        return paths.checkYourAppeal
    }

    get form() {}

    next() {
        return goTo(this.journey.Confirmation);
    }

}

module.exports = CheckYourAppeal;
