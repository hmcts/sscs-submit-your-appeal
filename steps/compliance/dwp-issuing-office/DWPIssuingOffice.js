'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { numbers } = require('utils/regex');
const officeIds = require('steps/compliance/dwp-issuing-office/dwpIssuingOfficeIds');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOffice extends Question {

    static get path() {

        return paths.compliance.dwpIssuingOffice;
    }

    get form() {

        return form(

            textField('pipNumber').joi(
                    this.content.fields.pipNumber.error.required,
                    Joi.string().required()
                ).joi(
                    this.content.fields.pipNumber.error.notNumeric,
                    Joi.string().regex(numbers)
                ).joi(
                    this.content.fields.pipNumber.error.invalid,
                    Joi.string().valid(officeIds)
                )
        )

    }

    next() {

        return goTo(this.journey.steps.MRNDate);
    }
}

module.exports = DWPIssuingOffice;
