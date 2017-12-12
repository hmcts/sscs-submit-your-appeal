'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

class BenefitType extends Question {

    static get path() {

        return paths.start.benefitType;
    }

    get form() {

        const types = Object.values(benefitTypes);

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
            section: sections.benefitType,
            answer: this.fields.benefitType.value
        });
    }

    values() {

        return {
            benefit: {
                type: this.fields.benefitType.value
            }
        };
    }

    next() {

        const isPIPBenefitType = () => this.fields.benefitType.value === 'Personal Independence Payment (PIP)';

        return branch(
            goTo(this.journey.steps.PostcodeChecker).if(isPIPBenefitType),
            goTo(this.journey.steps.AppointeeFormDownload)
        );
    }
}

module.exports = BenefitType;
