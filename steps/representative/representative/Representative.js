const { Question, form, field, branch, goTo } = require('@hmcts/one-per-page');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

const answer = {
    YES: 'yes',
    NO: 'no'
};

class Representative extends Question {

    get url() {
        return urls.representative.representative
    }

    get template() {
        return `representative/has-representative/template`;
    }

    get i18NextContent() {
        return content;
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            field('hasRepresentative')
              .joi(this.content.fields.hasRepresentative.error.required, Joi.string().valid(answers)
            )
        );
    }

    next() {
        const hasARepresentative = () => this.fields.hasRepresentative.value === answer.YES;

        return branch(
            goTo(this.journey.RepresentativeDetails).if(hasARepresentative),
            goTo(this.journey.ReasonForAppealing)
        )
    }
}

module.exports = Representative;
