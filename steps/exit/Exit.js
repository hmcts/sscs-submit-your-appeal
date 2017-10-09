const { ExitPoint } = require('@hmcts/one-per-page');
const urls = require('urls');

class Exit extends ExitPoint {

    get url() {
        return urls.session.exit;
    }
}

module.exports = Exit;
