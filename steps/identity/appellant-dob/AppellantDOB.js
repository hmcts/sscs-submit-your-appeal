'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const userAnswer = require('utils/answer');
const Joi = require('joi');
const paths = require('paths');

class AppellantDOB extends Question {

    static get path() {

        return paths.identity.enterAppellantDOB;
    }

    get isAppointee() {

        return this.fields.appointee.value === userAnswer.YES;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            textField('day').joi(
                fields.day.error.required,
                Joi.string().regex(numbers).required()),

            textField('month').joi(
                fields.month.error.required,
                Joi.string().regex(numbers).required()
            ),

            textField('year').joi(
                fields.year.error.required,
                Joi.string().regex(numbers).required()
            ),

            textField.ref(this.journey.steps.Appointee, 'appointee')
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dob.question,
                section: 'appellant-details',
                answer: `${this.fields.day.value}.${this.fields.month.value}.${this.fields.year.value}`
            })
        ];
    }

    next() {

        return goTo(this.journey.steps.AppellantNINO);
    }
}

module.exports = AppellantDOB;
