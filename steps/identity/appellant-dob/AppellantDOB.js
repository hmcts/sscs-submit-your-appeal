'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField, dateField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const Joi = require('joi');
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

class AppellantDOB extends Question {

    static get path() {

        return paths.identity.enterAppellantDOB;
    }

    get isAppointee() {

        return this.fields.appointee.value === userAnswer.YES;
    }

    get form() {

        const fields = this.content.fields;


        return form(

            dateField(
                'date',
                {
                    allRequired: fields.date.error.allRequired,
                    dayRequired: fields.date.error.dayRequired,
                    monthRequired: fields.date.error.monthRequired,
                    yearRequired: fields.date.error.yearRequired
                }
            ).check(
                fields.date.error.invalid,
                value => DateUtils.isDateValid(value)
            ).check(
                fields.date.error.future,
                value => DateUtils.isDateInPast(value)
            ),

            textField.ref(this.journey.steps.Appointee, 'appointee')
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dob.question,
                section: sections.appellantDetails,
                answer: `${this.fields.day.value}.${this.fields.month.value}.${this.fields.year.value}`
            })
        ];
    }

    values() {

        return {
            appellant: {
                dob: `${this.fields.day.value}-${this.fields.month.value}-${this.fields.year.value}`
            }
        };
    }

    next() {

        return goTo(this.journey.steps.AppellantNINO);
    }
}

module.exports = AppellantDOB;
