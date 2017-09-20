const { ExitPoint } = require('@hmcts/one-per-page');
const content = require('./content');

class Exit extends ExitPoint {
    get url() {
        return '/exit';
    }

    get i18NextContent() {
        return content;
    }
}

module.exports = Exit;
