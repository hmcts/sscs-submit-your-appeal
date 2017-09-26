const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');
const content = require('./content');
const urls = require('urls');

class CheckMRN extends Question {

    get url() {
        return urls.compliance.checkMRNDate;
    }

    get form() {
        return form(
            field('checkedMRN').content(this.content.fields.checkedMRN)
        );
    }

    get template() {
        return `compliance/check-mrn/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        if(this.fields.get('checkedMRN').value === 'yes') {

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
