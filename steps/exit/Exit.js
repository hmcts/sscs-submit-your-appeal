'use strict';

const { ExitPoint } = require('@hmcts/one-per-page');
const paths = require('paths');

class Exit extends ExitPoint {

    static get path() {

        return paths.session.exit;
    }
}

module.exports = Exit;
