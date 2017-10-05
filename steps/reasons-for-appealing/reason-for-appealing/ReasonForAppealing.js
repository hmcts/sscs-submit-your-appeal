const { Question } = require('@hmcts/one-per-page');
// const content = require('./content');
const urls = require('urls');

class ReasonForAppealing extends Question {

    get url() {
        return urls.reasonsForAppealing.reasonForAppealing;
    }

    get form() {
    }

    get template() {
        return 'reasons-for-appealing/reason-for-appealing/template';
    }

    // get i18NextContent() {
    //     return content;
    // }

    next() {}
}

module.exports = ReasonForAppealing;
