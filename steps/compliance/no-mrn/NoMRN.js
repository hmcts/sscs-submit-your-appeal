const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

class NoMRN extends Question {

    get url() {
        return urls.compliance.noMRN;
    }

    get form() {

        return form(

            field('reasonForNoMRN')
                .joi(this.content.fields.reasonForNoMRN.error.required, Joi.string().regex(whitelist).required())
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
