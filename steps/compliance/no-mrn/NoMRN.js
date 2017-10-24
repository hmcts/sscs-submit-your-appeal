'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class NoMRN extends Question {

    get url() {
        return paths.compliance.noMRN;
    }

    get form() {

        return form(

            textField('reasonForNoMRN').joi(
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
