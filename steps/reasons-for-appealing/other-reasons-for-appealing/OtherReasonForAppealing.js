'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const paths = require('paths');
const Joi = require('joi');

class OtherReasonForAppealing extends Question {

    get url() {

        return paths.reasonsForAppealing.otherReasonForAppealing;
    }

    get form() {

        return form(

            textField('otherReasonForAppealing').joi(
                this.content.fields.otherReasonForAppealing.error.invalid,
                Joi.string().regex(whitelist).allow('')
            )
        );
    }

    next() {

        return goTo(this.journey.SendingEvidence);
    }
}

module.exports = OtherReasonForAppealing;
