'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text, list } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

const REQUIRED = 'Required';
const NOT_REQUIRED = 'Not required';
const arrangements = {
    languageInterpreter: 'Language interpreter',
    signLanguageInterpreter: 'Sign language interpreter',
    hearingLoop: 'Hearing loop',
    accessibleHearingRoom: 'Accessible hearing rooms',
    other: 'Other'
};

const setCYAValue = (arrangementValue, hiddenFieldValue) => {

    let cyaValue;

    if (arrangementValue === REQUIRED && (hiddenFieldValue !== undefined && hiddenFieldValue !== '')) {
        cyaValue = hiddenFieldValue;
    } else {
        cyaValue = arrangementValue;
    }

    return cyaValue;

};

class HearingArrangements extends Question {

    static get path() {

        return paths.hearing.hearingArrangements;
    }

    get cyaArrangements() {

        const arrangementsAnswer = {
            languageInterpreter: NOT_REQUIRED,
            signLanguageInterpreter: NOT_REQUIRED,
            hearingLoop: NOT_REQUIRED,
            accessibleHearingRoom: NOT_REQUIRED,
            other: NOT_REQUIRED
        };

        this.fields.selection.value.forEach((arrangement) => {
            arrangementsAnswer[arrangement] = REQUIRED;
        });

        arrangementsAnswer.languageInterpreter = setCYAValue(arrangementsAnswer.languageInterpreter, this.fields.interpreterLanguageType.value);
        arrangementsAnswer.signLanguageInterpreter = setCYAValue(arrangementsAnswer.signLanguageInterpreter, this.fields.signLanguageType.value);
        arrangementsAnswer.other = setCYAValue(arrangementsAnswer.other, this.fields.anythingElse.value);

        return arrangementsAnswer;
    }

    get form() {

        const validAnswers = Object.keys(arrangements);

        return form(

            arrayField('selection').joi(
                this.content.fields.selection.error.required,
                Joi.array().items(validAnswers).min(1)
            ),

            textField('interpreterLanguageType').joi(
                this.content.fields.interpreterLanguageType.error.invalid,
                Joi.string().regex(whitelist).allow('')
            ),

            textField('signLanguageType').joi(
                this.content.fields.signLanguageType.error.invalid,
                Joi.string().regex(whitelist).allow('')
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
                section: sections.hearingArrangements,
                template: 'answer.html'
            })
        ];
    }

    values() {

        const values = {
            hearing: {
                arrangements: {
                    languageInterpreter: false,
                    signLanguageInterpreter: false,
                    hearingLoop: false,
                    accessibleHearingRoom: false,
                    other: false
                },
                interpreterLanguageType: this.fields.interpreterLanguageType.value,
                signLanguageType: this.fields.signLanguageType.value,
                anythingElse: this.fields.anythingElse.value,
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
