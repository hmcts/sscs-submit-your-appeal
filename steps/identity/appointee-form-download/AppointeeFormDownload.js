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

    get formDownload() {

        const benefitType = this.fields.benefitType.value;
        let formDownload = {};

        if (benefitType === 'Carer’s Allowance' || benefitType === 'Child Benefit') {
            formDownload.link = urls.formDownload.sscs5;
            formDownload.type = 'SSCS5';
        } else {
            formDownload.link = urls.formDownload.sscs1;
            formDownload.type = 'SSCS1';
        }

        return formDownload;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.BenefitType, 'benefitType')
        );
    }

}

module.exports = AppointeeFormDownload;
