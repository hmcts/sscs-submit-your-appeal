const { Page } = require('@hmcts/one-per-page');
const urls = require('urls');

class ContactDWP extends Page {

    get url() {
        return urls.compliance.contactDWP;
    }
}

module.exports = ContactDWP;
