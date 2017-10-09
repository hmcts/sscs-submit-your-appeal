const { Question, form, field, branch, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const urls = require('urls');

const answer = {
    YES: 'yes',
    NO: 'no'
};

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
        const isAnAppointee = () => this.fields.appointee.value === answer.YES;

        return branch(
            goTo(this.journey.AppointeeDetails).if(isAnAppointee),
            goTo(this.journey.AppellantDetails)
        );
    }
}

module.exports = Appointee;
