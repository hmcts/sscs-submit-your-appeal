'use strict';

const { Page } = require('@hmcts/one-per-page');
const paths = require('paths');

class ContactDWP extends Page {

    get url() {
        return paths.compliance.contactDWP;
    }
}

module.exports = ContactDWP;
