const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { benefitType } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

class BenefitType extends Question {

    get url() {
        return urls.start.benefitType;
    }

    get form() {
        return form(
            field('benefitType')
                .joi(this.content.fields.benefitType.error.required, Joi.string().regex(benefitType).required())
        );
    }

    next() {
        return goTo(this.journey.MRNDate);
    }
}

module.exports = BenefitType;
