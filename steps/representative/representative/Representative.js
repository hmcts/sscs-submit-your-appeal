'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class Representative extends Question {

    static get path() {

        return paths.representative.representative
    }

    get form() {

        const answers = [userAnswer.YES, userAnswer.NO];

        return form(

            textField('hasRepresentative').joi(
                this.content.fields.hasRepresentative.error.required,
                Joi.string().valid(answers)
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.hasRepresentative.question,
            section: 'representative',
            answer: titleise(this.fields.hasRepresentative.value)
        });

    }

    next() {

        const hasARepresentative = () => this.fields.hasRepresentative.value === userAnswer.YES;

        return branch(
            goTo(this.journey.steps.RepresentativeDetailsToHand).if(hasARepresentative),
            goTo(this.journey.steps.ReasonForAppealing)
        )
    }
}

module.exports = Representative;
