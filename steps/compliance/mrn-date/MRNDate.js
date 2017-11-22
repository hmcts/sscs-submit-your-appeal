'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const Joi = require('joi');

class MRNDate extends Question {

    get url() {

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

    next() {

        const mrnDate = DateUtils.createMoment(
            this.fields.day.value,
            this.fields.month.value,
            this.fields.year.value);

        if (DateUtils.isLessThanOrEqualToAMonth(mrnDate)) {

            return goTo(this.journey.Appointee);
        } else {

            return goTo(this.journey.CheckMRN);
        }
    }
}

module.exports = MRNDate;
