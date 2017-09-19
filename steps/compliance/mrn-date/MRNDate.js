const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');
const { regex } = require('utils/Validators');
const { numbers } = require('utils/regex');
const content = require('./content');

class MRNDate extends Question {

    get url() {
        return '/mrn-date';
    }

    get form() {

        return form(
            field('day').validate(regex(numbers, this.content.fields.day)),
            field('month').validate(regex(numbers, this.content.fields.month)),
            field('year').validate(regex(numbers, this.content.fields.year)),
        );
    }

    get template() {
        return `compliance/mrn-date/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        const mrnDate = DateUtils.createMoment(
            this.fields.get('day').value,
            this.fields.get('month').value,
            this.fields.get('year').value);

        if (DateUtils.isLessThanOrEqualToAMonth(mrnDate)) {

            // MRN is <= 1 month.
            return goTo(this.journey.Appointee);

        } else if (DateUtils.isLessThanOrEqualToThirteenMonths(mrnDate)) {

            // MRN is > 1 month and <= 13 months.
            return goTo(this.journey.MRNOverOneMonthLate); // This needs to be defined

        } else {

            // MRN is > 13 months.
            return goTo(this.journey.MRNOverThirteensMonthLate); // This needs to be defined

        }
    }
}

module.exports = MRNDate;
