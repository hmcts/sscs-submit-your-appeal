const { Question, form, field, branch, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const urls = require('urls');
const answer = require('utils/answer');

class Appointee extends Question {

    get url() {
        return urls.identity.areYouAnAppointee;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(
            field('appointee')
                .joi(this.content.fields.appointee.error.required, Joi.string().valid(answers))
        );
    }

    next() {
        return goTo(this.journey.AppellantDetails)
    }
}

module.exports = Appointee;
