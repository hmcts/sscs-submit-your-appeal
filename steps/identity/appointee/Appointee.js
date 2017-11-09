'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');

class Appointee extends Question {

    get url() {
        return paths.identity.areYouAnAppointee;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            textField('appointee').joi(
                this.content.fields.appointee.error.required,
                Joi.string().valid(answers)
            )
        );
    }

    next() {
        return goTo(this.journey.AppellantName)
    }
}

module.exports = Appointee;
