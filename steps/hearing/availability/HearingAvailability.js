'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingAvailability extends Question {

    get url() {

        return paths.hearing.hearingAvailability;
    }

    get form() {

        return form(

            textField('scheduleHearing').joi(
                this.content.fields.scheduleHearing.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO])
            )
        );
    }

    next() {

        const shouldScheduleHearing = () => this.fields.scheduleHearing.value === userAnswer.NO;

        return branch(
            goTo(this.journey.CheckYourAppeal).if(shouldScheduleHearing),
            goTo(this.journey.DatesCantAttend)
        );
    }
}

module.exports = HearingAvailability;
