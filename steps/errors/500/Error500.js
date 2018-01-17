const { Page } = require('@hmcts/one-per-page');


class Error500 extends Page {

    static get path() {

        return '/internal-server-error';
    }

    handler(req, res) {
        throw 'HTTP 500: An internal server error has occurred';
    }
}

module.exports = Error500;
