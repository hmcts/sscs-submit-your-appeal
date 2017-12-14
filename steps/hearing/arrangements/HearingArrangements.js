'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField, arrayField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class HearingArrangements extends Question {

    static get path() {
        return paths.hearing.hearingArrangements;
    }

    get form() {

        const validAnswers = [
            'Language interpreter',
            'Sign language interpreter',
            'Hearing loop',
            'Disabled access',
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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.selection.question,
                section: sections.hearingArrangements,
                answer: this.fields.selection.value.join(', ')
            }),

            answer(this, {
                question: this.content.cya.anythingElse.question,
                section: sections.hearingArrangements,
                answer: this.fields.anythingElse.value === '' ? 'Not required' : this.fields.anythingElse.value
            })
        ];
    }


    values() {

        return {
            hearing: {
                arrangements: this.fields.selection.value,
                anythingElse: this.fields.anythingElse.value
            }
        };
    }

    next() {
        return goTo(this.journey.steps.HearingAvailability);
    }
}

module.exports = HearingArrangements;
