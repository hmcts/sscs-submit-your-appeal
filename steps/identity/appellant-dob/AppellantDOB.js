'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const paths = require('paths');
const { numbers } = require('utils/regex');
const Joi = require('joi');
const answer = require('utils/answer');

class AppellantDOB extends Question {

    get url() {
        return paths.identity.enterAppellantDOB;
    }

    get isAppointee() {
        return this.fields.appointee.value === answer.YES;
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

            textField.ref(this.journey.Appointee, 'appointee')
        );
    }

    next() {
        return goTo(this.journey.AppellantNINO);
    }
}

module.exports = AppellantDOB;
