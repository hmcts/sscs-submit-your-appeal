'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const DateUtils = require('utils/DateUtils');

class DatesCantAttend extends Question {

    static get path() {

        return paths.hearing.datesCantAttend;
    }

    get form() {

        const fields = this.content.fields;

        return form({
            cantAttendDate: convert(
                d => DateUtils.createMoment(d.day, d.month, d.year),
                date.required({
                    allRequired: fields.cantAttendDate.error.allRequired,
                    dayRequired: fields.cantAttendDate.error.dayRequired,
                    monthRequired: fields.cantAttendDate.error.monthRequired,
                    yearRequired: fields.cantAttendDate.error.yearRequired
                })
            ).check(
                fields.cantAttendDate.error.invalid,
                value => DateUtils.isDateValid(value)
            )
        });

    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dateYouCantAttend.question,
                section: sections.theHearing,
                answer: this.fields.date.value.format('DD MMMM YYYY')
            })
        ];
    }

    values() {

        return {
            hearing: {
                datesCantAttend: [
                    this.fields.date.value.format('DD-MM-YYYY')
                ]
            }
        }
    }

    next() {

        return goTo(this.journey.steps.CheckYourAppeal);
    }
}

module.exports = DatesCantAttend;
