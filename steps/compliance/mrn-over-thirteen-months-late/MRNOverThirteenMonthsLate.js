const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');

class MRNOverThirteenMonthsLate extends Question {

    get url () {
        return '/mrn-over-thirteen-months-late';
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
