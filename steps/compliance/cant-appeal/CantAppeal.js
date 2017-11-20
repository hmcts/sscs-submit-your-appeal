'use strict';

const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class CantAppeal extends Page {

    get url () {

        return paths.compliance.cantAppeal;
    }

    next() {}
}

module.exports = CantAppeal;
