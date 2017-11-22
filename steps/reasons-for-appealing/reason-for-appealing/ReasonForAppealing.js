'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const paths = require('paths');
const Joi = require('joi');

class ReasonForAppealing extends Question {

    get url() {

        return paths.reasonsForAppealing.reasonForAppealing;
    }

    get form() {

        return form(

            textField('reasonForAppealing').joi(
                this.content.fields.reasonForAppealing.error.required,
                Joi.string().regex(whitelist)
            )
        );
    }

    next() {

        return goTo(this.journey.OtherReasonForAppealing);
    }
}

module.exports = ReasonForAppealing;
