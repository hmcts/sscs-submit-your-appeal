const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { benefitType } = require('utils/regex');
const content = require('./content');
const urls = require('urls');

class BenefitsType extends Question {

    get url() {
        return urls.start.benefitType;
    }

    get form() {

        return form(
            field('benefitType')
                .validate(regex(benefitType, this.content.fields.benefitType))
                .content(this.content.fields.benefitType),
        );
    }

    get template() {
        return `start/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        return goTo(this.journey.MRNDate);
    }
}

module.exports = BenefitsType;
