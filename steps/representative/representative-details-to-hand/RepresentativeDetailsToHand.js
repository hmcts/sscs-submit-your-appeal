'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class RepresentativeDetailsToHand extends Question {

    static get path() {

        return paths.representative.representativeDetailsToHand;
    }

    get form() {

        return form(

            textField('detailsToHand').joi(
                this.content.fields.detailsToHand.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.detailsToHand.question,
            section: 'representative',
            answer: titleise(this.fields.detailsToHand.value)
        });

    }

    next() {

        const hasDetailsToHand = () => this.fields.detailsToHand.value === userAnswer.YES;

        return branch(
            goTo(this.journey.steps.RepresentativeDetails).if(hasDetailsToHand),
            goTo(this.journey.steps.NoRepresentativeDetails)
        );
    }
}

module.exports = RepresentativeDetailsToHand;
