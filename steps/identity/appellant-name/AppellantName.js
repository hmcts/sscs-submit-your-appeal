'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { title, firstName, lastName } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');

class AppellantName extends Question {

    get url() {
        return paths.identity.enterAppellantName;
    }

    get isAppointee() {
        return this.fields.appointee.value === answer.YES;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            textField('title')
                .joi(fields.title.error.required, Joi.string().required())
                .joi(fields.title.error.invalid, Joi.string().regex(title)),

            textField('firstName')
                .joi(fields.firstName.error.required, Joi.string().required())
                .joi(fields.firstName.error.invalid, Joi.string().regex(firstName)),

            textField('lastName')
                .joi(fields.lastName.error.required, Joi.string().required())
                .joi(fields.lastName.error.invalid, Joi.string().regex(lastName)),

            textField.ref(this.journey.Appointee, 'appointee')
        );
    }

    next() {
        return goTo(this.journey.AppellantDOB);
    }
}

module.exports = AppellantName;
