'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class InvalidPostcode extends ExitPoint {

    static get path() {

        return paths.validPostcode.invalidPostcode;
    }

}

module.exports = InvalidPostcode;
