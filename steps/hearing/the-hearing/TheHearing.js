'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class TheHearing extends Question {

    get url() {

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

    next() {

        const isAttendingHearing = () => this.fields.attendHearing.value === userAnswer.YES;

        return branch(
            goTo(this.journey.HearingSupport).if(isAttendingHearing),
            goTo(this.journey.NotAttendingHearing)
        );
    }
}

module.exports = TheHearing;
