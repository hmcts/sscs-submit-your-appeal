'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HearingAvailability extends Question {

    static get path() {

        return paths.hearing.hearingAvailability;
    }

    get form() {

        return form(

            textField('scheduleHearing').joi(
                this.content.fields.scheduleHearing.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.scheduleHearing.question,
            section: sections.theHearing,
            answer: titleise(this.fields.scheduleHearing.value)
        });

    }

    values() {

        return {
            hearing: {
                scheduleHearing: this.fields.scheduleHearing.value === userAnswer.YES
            }
        }
    }

    next() {

        const shouldScheduleHearing = () => this.fields.scheduleHearing.value === userAnswer.NO;

        return branch(
            goTo(this.journey.steps.CheckYourAppeal).if(shouldScheduleHearing),
            goTo(this.journey.steps.DatesCantAttend)
        );
    }
}

module.exports = HearingAvailability;
