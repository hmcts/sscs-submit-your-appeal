'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');
const urls = require('urls');

class InvalidPostcode extends ExitPoint {

    static get path() {

        return paths.start.invalidPostcode;
    }

    get formUrl() {

        return urls.formDownload.sscs1;
    }

}

module.exports = InvalidPostcode;
