'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class HaveContactedDWP extends Question {

    static get path() {

        return paths.compliance.haveContactedDWP;
    }

    next() {
        return goTo(this.journey.steps.NoMRN);
    }
}

module.exports = HaveContactedDWP;
