'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const officeIds = require('steps/compliance/dwp-issuing-office/ids');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOffice extends Question {

    static get path() {

        return paths.compliance.dwpIssuingOffice;
    }

    get form() {

        return form(

            textField('pipNumber')

                .joi(
                    this.content.fields.pipNumber.error.required,
                    Joi.string().required())

                .joi(
                    this.content.fields.pipNumber.error.notNumeric,
                    Joi.string().regex(numbers))

                .joi(
                    this.content.fields.pipNumber.error.invalid,
                    Joi.string().valid(officeIds)
            )
        )
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.pipNumber.question,
                section: 'mrn-date',
                answer: this.fields.pipNumber.value
            }),
        ];
    }

    next() {

        return goTo(this.journey.steps.PostcodeChecker);
    }
}

module.exports = DWPIssuingOffice;
