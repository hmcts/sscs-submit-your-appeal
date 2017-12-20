'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { whitelist, firstName, lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class AppellantName extends Question {

    static get path() {

        return paths.identity.enterAppellantName;
    }

    get form() {

        const fields = this.content.fields;

        return form(

            textField('title')
                .joi(fields.title.error.required, Joi.string().required())
                .joi(fields.title.error.invalid, Joi.string().regex(whitelist)),

            textField('firstName')
                .joi(fields.firstName.error.required, Joi.string().required())
                .joi(fields.firstName.error.invalid, Joi.string().regex(firstName)),

            textField('lastName')
                .joi(fields.lastName.error.required, Joi.string().required())
                .joi(fields.lastName.error.invalid, Joi.string().regex(lastName))
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.appellantName.question,
                section: sections.appellantDetails,
                answer: `${this.fields.title.value} ${this.fields.firstName.value} ${this.fields.lastName.value}`
            })
        ];
    }

    values() {

        return {
            appellant: {
                title: this.fields.title.value,
                firstName: this.fields.firstName.value,
                lastName: this.fields.lastName.value
            }
        };
    }

    next() {

        return goTo(this.journey.steps.AppellantDOB);
    }
}

module.exports = AppellantName;
