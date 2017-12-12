'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class Independence extends Question {

    static get path() {

        return paths.start.independence;
    }

    next() {

        return goTo(this.journey.steps.DWPIssuingOffice);
    }
}

module.exports = Independence;
