'use strict';

const { BaseStep } = require('@hmcts/one-per-page');
const paths = require('paths');

class Sessions extends BaseStep {

    static get path() {

        return paths.session.sessions;
    }

    handler(req, res) {
        req.sessionStore.all((error, sessions) => {
            const indentTwoSpaces = 2;
            res.send(JSON.stringify(sessions, null, indentTwoSpaces));
        });
    }
}

module.exports = Sessions;
