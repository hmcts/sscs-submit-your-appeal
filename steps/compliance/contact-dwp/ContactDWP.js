const { Page } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class ContactDWP extends Page {

    get url() {
        return urls.compliance.contactDWP;
    }

    get template() {
        return `compliance/contact-dwp/template`;
    }

    get i18NextContent() {
        return content;
    }
}

module.exports = ContactDWP;
