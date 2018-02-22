'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField, arrayField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

const arrangements = {
    languageInterpreter: 'Language interpreter',
    signLanguageInterpreter: 'Sign language interpreter',
    hearingLoop: 'Hearing loop',
    disabledAccess: 'Disabled access'
};

class HearingArrangements extends Question {

    static get path() {

        return paths.hearing.hearingArrangements;
    }

    get form() {

        const validAnswers = Object.keys(arrangements);

        return form(

            arrayField('selection').joi(
                this.content.fields.selection.error.required,
                Joi.array().items(validAnswers).min(1)
            ),

            textField('anythingElse').joi(
                this.content.fields.anythingElse.error.required,
                Joi.string().regex(whitelist).allow('')
            )
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.selection.question,
                section: sections.hearingArrangements,
                answer: this.fields.selection.value.map((arrangement) => {
                    return arrangements[arrangement]
                }).join(', ')
            }),

            answer(this, {
                question: this.content.cya.anythingElse.question,
                section: sections.hearingArrangements,
                answer: this.fields.anythingElse.value ? this.fields.anythingElse.value : 'Not required'
            })
        ];
    }

    values() {

        const values = {
            hearing: {
                anythingElse: this.fields.anythingElse.value,
                arrangements: {
                    languageInterpreter: false,
                    signLanguageInterpreter: false,
                    hearingLoop: false,
                    disabledAccess: false
                }
            }
        };

        this.fields.selection.value.forEach((arrangement) => {
            values.hearing.arrangements[arrangement] = true;
        });

        return values;
    }

    next() {

        return goTo(this.journey.steps.HearingAvailability);
    }
}

module.exports = HearingArrangements;
