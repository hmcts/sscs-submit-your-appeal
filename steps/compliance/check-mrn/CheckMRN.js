const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const DateUtils = require('utils/DateUtils');
const content = require('./content');
const urls = require('urls');

const answer = {
    YES: 'yes',
    NO: 'no'
};

class CheckMRN extends Question {

    get url() {
        return urls.compliance.checkMRNDate;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            field('checkedMRN')
                .joi(this.content.fields.checkedMRN.error.required, Joi.string().valid(answers)
            )
        );
    }

    get template() {
        return `compliance/check-mrn/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        if(this.fields.checkedMRN.value === answer.YES) {

            const mrnDate = DateUtils.createMoment(
                this.locals.session.MRNDate_day,
                this.locals.session.MRNDate_month,
                this.locals.session.MRNDate_year);

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
