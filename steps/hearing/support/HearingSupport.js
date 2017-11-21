'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');
const { titleise } = require('utils/stringUtils');

class HearingSupport extends Question {

    get url() {

        return paths.hearing.hearingSupport;
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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.arrangements.question,
                section: sections.hearing.arrangements,
                answer: titleise(this.fields.arrangements.value)
            })
        ];
    }

    next() {

        const makeHearingArrangements = () => this.fields.arrangements.value === answer.YES;

        return branch(
            goTo(this.journey.HearingArrangements).if(makeHearingArrangements),
            goTo(this.journey.HearingAvailability)
        );
    }
}

module.exports = HearingSupport;
