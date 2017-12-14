'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const userAnswer = require('utils/answer');

class CheckMRN extends Question {

    static get path() {

        return paths.compliance.checkMRNDate;
    }

    get form() {

        return form(

            // Reference day, month and year from a previous step.
            textField.ref(this.journey.steps.MRNDate, 'day'),
            textField.ref(this.journey.steps.MRNDate, 'month'),
            textField.ref(this.journey.steps.MRNDate, 'year'),

            textField('checkedMRN').joi(
                this.content.fields.checkedMRN.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            )
        );
    }

    answers() {

        return [];
    }

    values() {

        return {};
    }

    next() {

        const mrnDate = DateUtils.createMoment(
            this.fields.day.value,
            this.fields.month.value,
            this.fields.year.value
        );

        const hasCheckedMRN = this.fields.checkedMRN.value === userAnswer.YES;
        const lessThan13Months = DateUtils.isLessThanOrEqualToThirteenMonths(mrnDate);

        return branch(
            goTo(this.journey.steps.MRNOverOneMonthLate).if(hasCheckedMRN && lessThan13Months),
            goTo(this.journey.steps.MRNOverThirteenMonthsLate).if(hasCheckedMRN),
            goTo(this.journey.steps.MRNDate)
        );
    }
}

module.exports = CheckMRN;
