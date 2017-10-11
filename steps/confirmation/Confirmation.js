'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class Confirmation extends Question {

    get url() {
        return urls.confirmation
    }

    get form() {}

    next() {
        goTo(undefined);
    }

}

module.exports = Confirmation;