'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');

class Arrangements extends Question {

    get url() {
        return paths.hearing.arrangements;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            textField('arrangements').joi(
                this.content.fields.arrangements.error.required,
                Joi.string().valid(answers)
            )
        );
    }

    next() {
        const makeHearingArrangements = () => this.fields.arrangements.value === answer.YES;

        return branch(
            goTo(this.journey.HearingArrangements).if(makeHearingArrangements),
            goTo(this.journey.HearingAvailibility)
        );
    }
}

module.exports = Arrangements;
