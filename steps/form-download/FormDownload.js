'use strict';

const {form} = require('@hmcts/one-per-page/forms');
const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class FormDownload extends Page {

    get url() {
        return paths.formDownload;
    }

}

module.exports = FormDownload;
