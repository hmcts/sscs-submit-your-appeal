'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, field } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

class NoMRN extends Question {

    get url() {
        return urls.compliance.noMRN;
    }

    get form() {

        return form(

            field('reasonForNoMRN').joi(
                this.content.fields.reasonForNoMRN.error.required,
                Joi.string().regex(whitelist).required()
            )
        );
    }

    next() {
        return goTo(this.journey.Appointee);
    }
}

module.exports = NoMRN;
