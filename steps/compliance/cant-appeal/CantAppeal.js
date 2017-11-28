'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class CantAppeal extends ExitPoint {

    static get path() {

        return paths.compliance.cantAppeal;
    }
}

module.exports = CantAppeal;
