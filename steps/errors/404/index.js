'use strict';

const { Page } = require('@hmcts/one-per-page');

class Error404 extends Page {

    static get path() {
        return '/error/404';
    }

    next() {}
}

module.exports = Error404;
