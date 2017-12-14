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

        return form(

            textField('reasonForAppealing').joi(
                this.content.fields.reasonForAppealing.error.required,
                Joi.string().regex(whitelist)
            )
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
