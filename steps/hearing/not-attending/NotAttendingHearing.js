'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const paths = require('paths');

class NotAttendingHearing extends Question {

    static get path() {

        return paths.hearing.notAttendingHearing;
    }

    get form() {

        return form(

            textField.ref(this.journey.steps.AppellantContactDetails, 'emailAddress')
        );
    }

    get byPostOrEmail() {

        return this.fields.emailAddress.value ? 'email' : 'post';
    }

    answers() {

        return [];
    }

    next() {

        return goTo(this.journey.steps.CheckYourAppeal);
    }
}

module.exports = NotAttendingHearing;
