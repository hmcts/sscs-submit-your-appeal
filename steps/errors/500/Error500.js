const { Page } = require('@hmcts/one-per-page');


class Error500 extends Page {

    static get path() {

        return '/internal-server-error';
    }

    handler(req, res) {
        throw 'This is an error that has been thrown on purpose to illustrate what happens in the event of an exception';
    }
}

module.exports = Error500;
