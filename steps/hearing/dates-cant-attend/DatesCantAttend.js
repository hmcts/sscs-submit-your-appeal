'use strict';

const { AddAnother } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page');
const { date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const content = require('steps/hearing/dates-cant-attend/content.en');

class DatesCantAttend extends AddAnother {

    get addAnotherLinkContent() {
        if (this.fields.items !== undefined) {
            return this.fields.items.value.length > 0 ? content.links.addAnother : content.links.add;
        }
        return '';
    }

    get field() {

        const fields = this.content.fields;

        return convert(
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
        ).check(
            fields.cantAttendDate.error.underFourWeeks,
            value => DateUtils.isDateOverFourWeeks(value)
        ).check(
            fields.cantAttendDate.error.overThirtyWeeks,
            value => DateUtils.isDateUnderThirtyWeeks(value)
        );
    }

    validateList(list) {
        return list.check(content.listError, arr => arr.length > 0);
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dateYouCantAttend.question,
                section: sections.theHearing,
                answer: this.fields.items.value.map(d => d.format('DD MMMM YYYY'))
            })
        ];
    }

    values() {

        const utfStamps = this.fields.items.value.map(d => d.format('DD-MM-YYYY'));

        if (utfStamps.length === 0) {
            return {};
        }
        return { unavailableDates: utfStamps }
    }

    next() {

        return goTo(this.journey.steps.CheckYourAppeal);
    }
}

module.exports = DatesCantAttend;
