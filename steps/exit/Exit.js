'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class Exit extends ExitPoint {

    get url() {

        return paths.session.exit;
    }
}

module.exports = Exit;
