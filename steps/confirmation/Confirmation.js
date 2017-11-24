'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class Confirmation extends ExitPoint {

    static get path() {

        return paths.confirmation;
    }
}

module.exports = Confirmation;
