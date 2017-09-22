const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');

class NoMRN extends Question {

    get url() {
        return '/no-mrn';
    }

    get form() {

        const fields = this.content.fields;

        return form(

            field('reasonForNoMRN')
                .validate(regex(whitelist, fields.reasonForNoMRN))
                .content(fields.reasonForNoMRN),
        );
    }

    get template() {
        return `compliance/no-mrn/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        return goTo(this.journey.Appointee);
    }
}

module.exports = NoMRN;
