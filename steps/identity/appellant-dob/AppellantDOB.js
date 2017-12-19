'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField, dateField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { numbers } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const Joi = require('joi');
const paths = require('paths');
const moment = require('moment');

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

            dateField(
                'date',
                {
                    allRequired: fields.date.error.allRequired,
                    dayRequired: fields.date.error.dayRequired,
                    monthRequired: fields.date.error.monthRequired,
                    yearRequired: fields.date.error.yearRequired
                }
            ).check(
                'MEOW',
                (d)=>{
                    console.log(d)
                    const now = moment();
                    const date = moment(`${d.day}-${d.month}-${d.year}`, 'DD-MM-YYYY', true);
                    console.log(now);
                    console.log(date)
                    console.log(date.isValid())
                    if (date.isValid()) {
                        return true;
                    }
                    return false
                }
            ),

            textField.ref(this.journey.steps.Appointee, 'appointee')
        );

        //     textField('day').joi(
        //         fields.day.error.required,
        //         Joi.string().regex(numbers).required()),
        //
        //     textField('month').joi(
        //         fields.month.error.required,
        //         Joi.string().regex(numbers).required()
        //     ),
        //
        //     textField('year').joi(
        //         fields.year.error.required,
        //         Joi.string().regex(numbers).required()
        //     ),
        //
        //     textField.ref(this.journey.steps.Appointee, 'appointee')
        // );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.dob.question,
                section: sections.appellantDetails,
                answer: `${this.fields.day.value}.${this.fields.month.value}.${this.fields.year.value}`
            })
        ];
    }

    values() {

        return {
            appellant: {
                dob: `${this.fields.day.value}-${this.fields.month.value}-${this.fields.year.value}`
            }
        };
    }

    next() {

        return goTo(this.journey.steps.AppellantNINO);
    }
}

module.exports = AppellantDOB;
