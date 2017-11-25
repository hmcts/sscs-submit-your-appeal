'use strict';

const {form} = require('@hmcts/one-per-page/forms');
const {Question, goTo} = require('@hmcts/one-per-page');
const paths = require('paths');

class FormDownload extends Question {

    get url() {
        return paths.formDownload;
    }

    get form() {
        return form();
    }

    next() {
        return goTo(undefined);
    }
}

module.exports = FormDownload;
