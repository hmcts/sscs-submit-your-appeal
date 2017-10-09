const { Page } = require('@hmcts/one-per-page');
const urls = require('urls');

class CantAppeal extends Page {

    get url () {
        return urls.compliance.cantAppeal;
    }

    next() {}
}

module.exports = CantAppeal;
