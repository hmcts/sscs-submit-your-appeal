'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class MRNOverThirteenMonthsLate extends Question {

    static get path() {

        return paths.compliance.mrnOverThirteenMonthsLate;
    }

    get form() {

        return form(

            textField('reasonForBeingLate').joi(
                this.content.fields.reasonForBeingLate.error.required,
                Joi.string().regex(whitelist).required()
            )
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.reasonForBeingLate.question,
                section: 'mrn-over-thirteen-months-late',
                answer: `${this.fields.reasonForBeingLate.value}`
            })
        ];
    }

    next() {

        return goTo(this.journey.steps.Appointee);
    }
}

module.exports = MRNOverThirteenMonthsLate;
