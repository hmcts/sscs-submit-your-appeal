'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class ContactDWP extends ExitPoint {

    get url() {

        return paths.compliance.contactDWP;
    }
}

module.exports = ContactDWP;
