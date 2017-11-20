'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { benefitType } = require('utils/regex');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class BenefitType extends Question {

    get url() {

        return paths.start.benefitType;
    }

    get form() {

        return form(

            textField('benefitType').joi(
                this.content.fields.benefitType.error.required,
                Joi.string().regex(benefitType).required()
            )
        );
    }

    answers() {

        return answer(this, {
            question: this.content.cya.benefitType.question,
            section: sections.start.benefitType,
            answer: this.fields.benefitType.value
        });
    }

    next() {

        return goTo(this.journey.MRNDate);
    }
}

module.exports = BenefitType;
