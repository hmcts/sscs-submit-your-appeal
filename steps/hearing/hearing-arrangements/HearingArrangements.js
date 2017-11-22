'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField, arrayField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class HearingArrangements extends Question {

    get url() {
        return paths.hearing.hearingArrangements;
    }

    get form() {

        const validAnswers = [
            'languageInterpreter',
            'signLanguageInterpreter',
            'hearingLoop',
            'disabledAccess',
        ];

        return form(

            arrayField('selection').joi(
                this.content.fields.selection.error.required,
                Joi.array().items(validAnswers).min(1)
            ),

            textField('anythingElse').joi(
                this.content.fields.anythingElse.error.required,
                Joi.string().regex(whitelist).required().allow('')
            )
        );
    }

    next() {
        return goTo(this.journey.HearingAvailability);
    }
}

module.exports = HearingArrangements;
