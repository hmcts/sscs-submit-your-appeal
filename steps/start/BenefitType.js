'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { benefitType } = require('utils/regex');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');

class BenefitType extends Question {

    static get path() {

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
            section: 'benefit-type',
            answer: this.fields.benefitType.value
        });
    }

    next() {
        const isPIPBenefitType = () => this.fields.benefitType.value === 'Personal Independence Payment (PIP)';

        return branch(
            goTo(this.journey.steps.DWPIssuingOffice).if(isPIPBenefitType),
            goTo(this.journey.steps.MRNDate)
        );
    }
}

module.exports = BenefitType;
