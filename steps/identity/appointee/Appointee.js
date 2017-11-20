'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class Appointee extends Question {

    get url() {

        return paths.identity.areYouAnAppointee;
    }

    get form() {

        return form(

            textField('appointee').joi(
                this.content.fields.appointee.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO])
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.appointee.question,
            section: sections.appointee.id,
            answer: titleise(this.fields.appointee.value)
        });

    }

    next() {

        return goTo(this.journey.AppellantName)
    }
}

module.exports = Appointee;
