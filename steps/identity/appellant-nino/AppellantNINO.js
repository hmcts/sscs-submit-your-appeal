'use strict';

const {form, textField} = require('@hmcts/one-per-page/forms');
const {Question, goTo} = require('@hmcts/one-per-page');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const {niNumber} = require('utils/regex');
const userAnswer = require('utils/answer');
const paths = require('paths');
const Joi = require('joi');

class AppellantNINO extends Question {

    static get path() {

        return paths.identity.enterAppellantNINO;
    }

    get isAppointee() {

        return this.fields.appointee.value === userAnswer.YES;
    }

    get form() {

        return form(

            textField('nino').joi(
                this.content.fields.nino.error.required,
                Joi.string().regex(niNumber).required()),

            textField.ref(this.journey.Appointee, 'appointee')
        );
    }

    answers() {

        return [

            answer(this, {
                question: this.content.cya.nino.question,
                section: 'appellant-details',
                answer: this.fields.nino.value
            })
        ];
    }

    next() {

        return goTo(this.journey.AppellantContactDetails);
    }
}

module.exports = AppellantNINO;
