'use strict';

const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');

class MRNDate extends Question {

    static get path() {

        return paths.compliance.mrnDate;
    }

    get form() {

        const fields = this.content.fields;

        return form({
            mrnDate: convert(
                d => DateUtils.createMoment(d.day, d.month, d.year),
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
            ).check(
                fields.date.error.dateSameAsImage,
                value => !DateUtils.mrnDateSameAsImage(value)
            )

        });
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.mrnDate.question,
                section: sections.mrnDate,
                answer: this.fields.mrnDate.value.format('DD MMMM YYYY')
            })
        ];
    }

    values() {

        return {
            mrn: {
                date: this.fields.mrnDate.value.format('DD-MM-YYYY')
            }
        };
    }

    next() {

        const mrnDate = this.fields.mrnDate.value;

        const isLessThanOrEqualToAMonth = DateUtils.isLessThanOrEqualToAMonth(mrnDate);

        return branch(
            goTo(this.journey.steps.AppellantName).if(isLessThanOrEqualToAMonth),
            redirectTo(this.journey.steps.CheckMRN)
        );
    }
}

module.exports = MRNDate;
