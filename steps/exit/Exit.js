const { ExitPoint } = require('@hmcts/one-per-page');
const content = require('./content');
const urls = require('urls');

class Exit extends ExitPoint {

    get url() {
        return urls.session.exit;
    }

    get i18NextContent() {
        return content;
    }
}

module.exports = Exit;
