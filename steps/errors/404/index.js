const { Page } = require('@hmcts/one-per-page');

class Error404 extends Page {

    get url() {
        return '/error/404';
    }

    next() {}
}

module.exports = Error404;
