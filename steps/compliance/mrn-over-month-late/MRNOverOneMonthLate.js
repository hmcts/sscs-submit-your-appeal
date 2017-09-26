const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');
const urls = require('urls');

class MRNOverOneMonthLate extends Question {

    get url () {
        return urls.compliance.mrnOverMonthLate;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            field('reasonForBeingLate')
                .validate(regex(whitelist, fields.reasonForBeingLate))
                .content(fields.reasonForBeingLate)
        );
    }

    get template() {
        return `compliance/mrn-over-month-late/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        return goTo(this.journey.Appointee);
    }
}

module.exports = MRNOverOneMonthLate;
