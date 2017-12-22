'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const paths = require('paths');

class Independence extends Question {

    static get path() {

        return paths.start.independence;
    }

    answers() {

        return answer(this, { hide: true });
    }

    next() {

        return goTo(this.journey.steps.HaveAMRN);
    }
}

module.exports = Independence;
