'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class CantAppeal extends ExitPoint {

    get url () {

        return paths.compliance.cantAppeal;
    }
}

module.exports = CantAppeal;
