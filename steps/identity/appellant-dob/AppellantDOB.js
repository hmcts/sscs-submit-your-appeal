'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const DateUtils = require('utils/DateUtils');

class AppellantDOB extends Question {

    static get path() {

        return paths.identity.enterAppellantDOB;
    }

    get form() {

        const fields = this.content.fields;

        return form({
            date: convert(
                d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d), d.year),
                date.required({
                    allRequired: fields.date.error.allRequired,
                    dayRequired: fields.date.error.dayRequired,
                    monthRequired: fields.date.error.monthRequired,
                    yearRequired: fields.date.error.yearRequired
                })
            ).check(
                fields.date.error.invalid,
                value => DateUtils.isDateValid(value)
            ).check(
                fields.date.error.future,
                value => DateUtils.isDateInPast(value)
            )
        });

    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dob.question,
                section: sections.appellantDetails,
                answer: this.fields.date.value.format('DD MMMM YYYY')
            })
        ];
    }

    values() {

        return {
            appellant: {
                dob: this.fields.date.value.format('DD-MM-YYYY')
            }
        };
    }

    next() {

        return goTo(this.journey.steps.AppellantNINO);
    }
}

module.exports = AppellantDOB;
