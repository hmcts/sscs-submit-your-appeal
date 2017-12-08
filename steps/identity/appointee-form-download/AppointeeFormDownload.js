'use strict';

const { form, textField } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');
const urls = require('urls');

class AppointeeFormDownload extends Question {

    static get path() {

        return paths.identity.downloadAppointeeForm;
    }

    get benefitType() {

        return this.fields.benefitType.value;
    }

    get getFormLink() {

        const benefitType = this.fields.benefitType.value;
        let link;

        if (benefitType === 'Carer’s Allowance' || benefitType === 'Child Benefit') {
            link = urls.formDownload.sscs5;
        } else {
            link = urls.formDownload.sscs1;
        }

        return link;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.BenefitType, 'benefitType')
        );
    }

}

module.exports = AppointeeFormDownload;
