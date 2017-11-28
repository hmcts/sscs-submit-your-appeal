'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppointeeFormDownload extends ExitPoint {

    static get path() {

        return paths.identity.downloadAppointeeForm;
    }

    get form() {}


    next() {}
}

module.exports = AppointeeFormDownload;
