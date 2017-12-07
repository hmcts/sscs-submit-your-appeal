'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const types = require('steps/start/types');

class Independence extends Question {

    static get path() {

        return paths.start.independence;
    }

    get form() {

        return form();
    }

    answers() {

        return [];
    }

    next() {

        return goTo(this.journey.steps.MRNDate);
    }
}

module.exports = Independence;
