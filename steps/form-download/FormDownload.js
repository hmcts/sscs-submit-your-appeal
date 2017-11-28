'use strict';

const paths = require('paths');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { Question, goTo } = require('@hmcts/one-per-page');
const content = require('steps/form-download/content.en.json');

class FormDownload extends Question {

    get url() {
        return paths.formDownload;
    }

    get benefitType() {
        return content.subtitle.replace(content.benefitTypePlaceholder, this.fields.benefitType.value);
    }

    get form() {
        return form(
            textField.ref(this.journey.BenefitType, 'benefitType')
        );
    }

    next() {}

}

module.exports = FormDownload;
