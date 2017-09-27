const { Page } = require('@hmcts/one-per-page');

class Error500 extends Page {

    get url() {
        return '/error/500';
    }

    next() {}
}

module.exports = Error500;
