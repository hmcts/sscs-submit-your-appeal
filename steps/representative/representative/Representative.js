'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const answer = require('utils/answer');

class Representative extends Question {

    get url() {
        return paths.representative.representative
    }

    get form() {

        const answers = [answer.YES, answer.NO];

        return form(

            textField('hasRepresentative').joi(
                this.content.fields.hasRepresentative.error.required,
                Joi.string().valid(answers)
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
