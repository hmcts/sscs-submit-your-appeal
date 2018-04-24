'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class MRNOverThirteenMonthsLate extends Question {

    static get path() {

        return paths.compliance.mrnOverThirteenMonthsLate;
    }

    get form() {

        return form({

            reasonForBeingLate: text
                .joi(
                    this.content.fields.reasonForBeingLate.error.required,
                    Joi.string().required()
                )
                .joi(
                    this.content.fields.reasonForBeingLate.error.notEnough,
                    Joi.string().min(5)
                )
                .joi(
                    this.content.fields.reasonForBeingLate.error.invalid,
                    Joi.string().regex(whitelist)
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

module.exports = MRNOverThirteenMonthsLate;
