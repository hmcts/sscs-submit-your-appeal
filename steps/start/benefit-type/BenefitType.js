'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const types = require('steps/start/benefit-type/types');

class BenefitType extends Question {

    static get path() {

        return paths.start.benefitType;
    }

    get form() {

        return form(

            textField('benefitType').joi(
                this.content.fields.benefitType.error.required,
                Joi.string().valid(types).required()
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
            goTo(this.journey.steps.AppointeeFormDownload)
        );
    }
}

module.exports = BenefitType;
