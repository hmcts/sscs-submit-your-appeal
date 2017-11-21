'use strict';

const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppointeeFormDownload extends Page {

    get url() {

        return paths.identity.appointeeFormDownload;
    }

    get form() {}


    next() {}
}

module.exports = AppointeeFormDownload;
