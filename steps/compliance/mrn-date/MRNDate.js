'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const Joi = require('joi');

class MRNDate extends Question {

    static get path() {

        return paths.compliance.mrnDate;
    }

    get form() {

        return form(

            textField('day').joi(
                this.content.fields.day.error.required,
                Joi.string().regex(numbers).required()),

            textField('month').joi(
                this.content.fields.month.error.required,
                Joi.string().regex(numbers).required()
            ),

            textField('year').joi(
                this.content.fields.year.error.required,
                Joi.string().regex(numbers).required()
            )
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.mrnDate.question,
                section: 'mrn-date',
                answer: `${this.fields.day.value}/${this.fields.month.value}/${this.fields.year.value}`
            })
        ];
    }

    values() {

        return {
            mrn: {
                date: `${this.fields.day.value}-${this.fields.month.value}-${this.fields.year.value}`
            }
        };
    }

    next() {

        const mrnDate = DateUtils.createMoment(
            this.fields.day.value,
            this.fields.month.value,
            this.fields.year.value);

        const isLessThanOrEqualToAMonth = DateUtils.isLessThanOrEqualToAMonth(mrnDate);

        return branch(
            goTo(this.journey.steps.Appointee).if(isLessThanOrEqualToAMonth),
            goTo(this.journey.steps.CheckMRN)
        );
    }
}

module.exports = MRNDate;
