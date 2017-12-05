'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class Appointee extends Question {

    static get path() {

        return paths.identity.areYouAnAppointee;
    }

    get form() {

        return form(

            textField('appointee').joi(
                this.content.fields.appointee.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.appointee.question,
            section: 'appellant-details',
            answer: titleise(this.fields.appointee.value)
        });

    }

    next() {

        const isAppointee = () => this.fields.appointee.value === userAnswer.YES;

        return branch(
            goTo(this.journey.steps.AppointeeFormDownload).if(isAppointee),
            goTo(this.journey.steps.AppellantName)
        );
    }
}

module.exports = Appointee;
