const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const answer = require('utils/answer');

class CheckMRN extends Question {

    get url() {
        return paths.compliance.checkMRNDate;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            // Reference day, month and year from a previous step.
            textField.ref(this.journey.MRNDate, 'day'),
            textField.ref(this.journey.MRNDate, 'month'),
            textField.ref(this.journey.MRNDate, 'year'),

            textField('checkedMRN').joi(
                this.content.fields.checkedMRN.error.required,
                Joi.string().valid(answers)
            )
        );
    }

    next() {
        if(this.fields.checkedMRN.value === answer.YES) {

            const mrnDate = DateUtils.createMoment(
                this.fields.day.value,
                this.fields.month.value,
                this.fields.year.value
            );

            if (DateUtils.isLessThanOrEqualToThirteenMonths(mrnDate)) {

                // MRN is > 1 month and <= 13 months.
                return goTo(this.journey.MRNOverOneMonthLate);

            } else {

                // MRN is > 13 months.
                return goTo(this.journey.MRNOverThirteenMonthsLate);
            }

        } else {
            return goTo(this.journey.MRNDate);
        }
    }
}

module.exports = CheckMRN;
