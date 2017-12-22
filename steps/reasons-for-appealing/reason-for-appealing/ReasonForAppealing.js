'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');

class ReasonForAppealing extends Question {

    static get path() {

        return paths.reasonsForAppealing.reasonForAppealing;
    }

    get form() {

        const reasonForAppealing = this.content.fields.reasonForAppealing;

        return form(

            textField('reasonForAppealing').joi(
                reasonForAppealing.error.required,
                Joi.string().regex(whitelist).trim().required())
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.reasonForAppealing.question,
                section: sections.reasonsForAppealing,
                answer: this.fields.reasonForAppealing.value
            })
        ];
    }

    values() {

        return {
            reasonsForAppealing: {
                reasons: this.fields.reasonForAppealing.value
            }
        };
    }

    next() {

        return goTo(this.journey.steps.OtherReasonForAppealing);
    }
}

module.exports = ReasonForAppealing;
