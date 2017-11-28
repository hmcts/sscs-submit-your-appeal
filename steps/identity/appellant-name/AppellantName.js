'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { title, firstName, lastName } = require('utils/regex');

const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class AppellantName extends Question {

    static get path() {

        return paths.identity.enterAppellantName;
    }

    get isAppointee() {

        return this.fields.appointee.value === userAnswer.YES;
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

    answers() {

        return [

            answer(this, {
                question: this.content.cya.appellantName.question,
                section: 'appellant-details',
                answer: `${this.fields.title.value} ${this.fields.firstName.value} ${this.fields.lastName.value}`
            })
        ];
    }

    next() {

        return goTo(this.journey.AppellantDOB);
    }
}

module.exports = AppellantName;
