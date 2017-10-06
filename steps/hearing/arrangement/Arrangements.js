const { Question, form, field, branch, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

const answer = {
    YES: 'yes',
    NO: 'no'
};

class Arrangements extends Question {

    get url() {
        return urls.hearing.arrangements;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(
            field('arrangements')
                .joi(this.content.fields.arrangements.error.required, Joi.string().valid(answers))
        );
    }

    get i18NextContent() {
        return content;
    }

    next() {
        const makeHearingArrangements = () => this.fields.arrangements.value === answer.YES;

        return branch(
            goTo(this.journey.HearingArrangements).if(makeHearingArrangements),
            goTo(this.journey.HearingAvailibility)
        );
    }
}

module.exports = Arrangements;
