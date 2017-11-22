'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class AppointeeFormDownload extends ExitPoint {

    get url() {

        return paths.identity.appointeeFormDownload;
    }

    get form() {}


    next() {}
}

module.exports = AppointeeFormDownload;
