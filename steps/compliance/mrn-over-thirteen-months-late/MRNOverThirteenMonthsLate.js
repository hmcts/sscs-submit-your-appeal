const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');
const urls = require('urls');

class MRNOverThirteenMonthsLate extends Question {

    get url () {
        return urls.compliance.mrnOverThirteenMonthsLate;
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
        return `compliance/mrn-over-thirteen-months-late/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        return goTo(this.journey.Appointee);
    }
}

module.exports = MRNOverThirteenMonthsLate;
