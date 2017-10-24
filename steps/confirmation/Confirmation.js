'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class Confirmation extends ExitPoint {

    get url() {
        return paths.confirmation;
    }
}

module.exports = Confirmation;
