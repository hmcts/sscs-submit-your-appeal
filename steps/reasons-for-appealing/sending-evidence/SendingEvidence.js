'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class SendingEvidence extends Question {

    static get path() {

        return paths.reasonsForAppealing.sendingEvidence;
    }

    get hasSignedUpForEmail() {

        return this.fields.emailAddress.value.length > 0;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.AppellantContactDetails, 'emailAddress')
        );
    }

    next() {

        return goTo(this.journey.steps.TheHearing);
    }
}

module.exports = SendingEvidence;
