const { Page } = require('@hmcts/one-per-page');
const content = require('./content');

class ContactDWP extends Page {

    get url() {
        return '/contact-dwp';
    }

    get template() {
        return `compliance/contact-dwp/template`;
    }

    get i18NextContent() {
        return content;
    }
}

module.exports = ContactDWP;
