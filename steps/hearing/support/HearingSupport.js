'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingSupport extends Question {

    get url() {

        return paths.hearing.hearingSupport;
    }

    get form() {

        const answers = [userAnswer.YES, userAnswer.NO];

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
                section: 'hearing-support',
                answer: titleise(this.fields.arrangements.value)
            })
        ];
    }

    next() {

        const makeHearingArrangements = () => this.fields.arrangements.value === userAnswer.YES;

        return branch(
            goTo(this.journey.HearingArrangements).if(makeHearingArrangements),
            goTo(this.journey.HearingAvailability)
        );
    }
}

module.exports = HearingSupport;
