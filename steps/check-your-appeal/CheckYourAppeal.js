'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class CheckYourAppeal extends Question {

    get url() {
        return urls.checkYouAppeal
    }

    get form() {}

    next() {
        return goTo(this.journey.Confirmation);
    }

}

module.exports = CheckYourAppeal;
