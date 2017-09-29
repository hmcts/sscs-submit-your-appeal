const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

class MRNOverThirteenMonthsLate extends Question {

    get url () {
        return urls.compliance.mrnOverThirteenMonthsLate;
    }

    get form() {
        return form(
            field('reasonForBeingLate').joi(
                this.content.fields.reasonForBeingLate.error.required,
                Joi.string().regex(whitelist).required()
            )
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
