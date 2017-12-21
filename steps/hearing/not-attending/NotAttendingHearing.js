'use strict';

const { Question, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
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

    answers() {
        return answer(this, { hide: true });
    }

    get byPostOrEmail() {

        return this.fields.emailAddress.value ? 'email' : 'post';
    }

    next() {

        return goTo(this.journey.steps.CheckYourAppeal);
    }
}

module.exports = NotAttendingHearing;
