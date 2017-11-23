'use strict';

const {form, textField} = require('@hmcts/one-per-page/forms');
const {Question, goTo} = require('@hmcts/one-per-page');
const answer = require('utils/answer');
const paths = require('paths');

class FormDownload extends Question {

    get url() {
        return paths.formDownload;
    }

    get isAppointee() {
        return this.fields.appointee.value === answer.YES;
    }

    get form() {
        return form(
            textField.ref(this.journey.Appointee, 'appointee')
        );
    }

    next() {
        return goTo(undefined);
    }
}

module.exports = FormDownload;
