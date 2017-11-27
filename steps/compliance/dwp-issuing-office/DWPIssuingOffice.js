'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { benefitType } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOffice extends Question {

    get url() {
        return paths.compliance.dwpIssuingOffice;
    }

    get form() {

        return form(
            textField('pipNumber').joi(

            )
        )

    }

    next() {

        return goTo(this.journey.MRNDate);
    }
}

module.exports = DWPIssuingOffice;
