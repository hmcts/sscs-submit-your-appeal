'use strict';

const { form, textField } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppointeeFormDownload extends Question {

    static get path() {

        return paths.identity.downloadAppointeeForm;
    }

    get benefitType() {

        return this.fields.benefitType.value;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.BenefitType, 'benefitType')
        );
    }

}

module.exports = AppointeeFormDownload;
