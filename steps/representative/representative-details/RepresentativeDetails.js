const { Question } = require('@hmcts/one-per-page');
// const content = require('./content');
const urls = require('urls');

class RepresentativeDetails extends Question {

    get url() {
        return urls.representative.representativeDetails;
    }

    get form() {
    }

    get template() {
        return `representative/representative-details/template`;
    }

    // get i18NextContent() {
    //     return content;
    // }

    next() {}
}

module.exports = RepresentativeDetails;
