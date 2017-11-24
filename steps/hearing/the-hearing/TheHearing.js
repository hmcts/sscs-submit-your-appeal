'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class TheHearing extends Question {

    static get path() {

        return paths.hearing.theHearing;
    }

    get form() {

        return form(

            textField('attendHearing').joi(
                this.content.fields.attendHearing.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO])
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.attendHearing.question,
            section: 'hearing',
            answer: titleise(this.fields.attendHearing.value)
        });

    }

    next() {

        const isAttendingHearing = () => this.fields.attendHearing.value === userAnswer.YES;

        return branch(
            goTo(this.journey.HearingSupport).if(isAttendingHearing),
            goTo(this.journey.NotAttendingHearing)
        );
    }
}

module.exports = TheHearing;
