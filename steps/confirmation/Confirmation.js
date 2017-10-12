'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const urls = require('urls');

class Confirmation extends ExitPoint {

    get url() {
        return urls.session.exit;
    }
}

module.exports = Confirmation;
