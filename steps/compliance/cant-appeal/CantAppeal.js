const { Page } = require('@hmcts/one-per-page');
const content = require('./content');

class CantAppeal extends Page {

    get url () {
        return '/cant-appeal';
    }

    get template() {
        return `compliance/cant-appeal/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {}
}

module.exports = CantAppeal;
