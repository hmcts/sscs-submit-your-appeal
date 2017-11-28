'use strict';

const { Page } = require('@hmcts/one-per-page');

class Error500 extends Page {

    static get path() {
        return '/error/500';
    }

    next() {}
}

module.exports = Error500;
