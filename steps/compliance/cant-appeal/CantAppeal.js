const { Page } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class CantAppeal extends Page {

    get url () {
        return urls.compliance.cantAppeal;
    }

    get i18NextContent() {
        return content;
    }

    next() {}
}

module.exports = CantAppeal;
