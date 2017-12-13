'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');

class DatesCantAttend extends Question {

    static get path() {

        return paths.hearing.datesCantAttend;
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
                question: this.content.cya.dateYouCantAttend.question,
                section: sections.theHearing,
                answer: `${this.fields.day.value}/${this.fields.month.value}/${this.fields.year.value}`
            })
        ];
    }

    values() {

        return {
            hearing: {
                datesCantAttend: [
                    `${this.fields.day.value}/${this.fields.month.value}/${this.fields.year.value}`
                ]
            }
        }
    }

    next() {

        return goTo(this.journey.steps.CheckYourAppeal);
    }
}

module.exports = DatesCantAttend;
