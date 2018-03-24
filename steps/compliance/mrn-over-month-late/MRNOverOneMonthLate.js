'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class MRNOverOneMonthLate extends Question {

    static get path() {

        return paths.compliance.mrnOverMonthLate;
    }

    get form() {

        return form({

            reasonForBeingLate: text
                .joi(
                    this.content.fields.reasonForBeingLate.error.required,
                    Joi.string().regex(whitelist).required()
                )
        });
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.reasonForBeingLate.question,
                section: sections.mrnDate,
                answer: this.fields.reasonForBeingLate.value
            })
        ];
    }

    values() {

        return {
            mrn: {
                reasonForBeingLate: this.fields.reasonForBeingLate.value
            }
        };
    }

    next() {

        return goTo(this.journey.steps.AppellantName);
    }
}

module.exports = MRNOverOneMonthLate;
