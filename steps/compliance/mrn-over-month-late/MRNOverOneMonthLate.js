'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class MRNOverOneMonthLate extends Question {

    get url () {

        return paths.compliance.mrnOverMonthLate;
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
                section: 'mrn-over-month-late',
                answer: `${this.fields.reasonForBeingLate.value}`
            })
        ];
    }

    next() {

        return goTo(this.journey.Appointee);
    }
}

module.exports = MRNOverOneMonthLate;
