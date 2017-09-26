const { Question, goTo } = require('@hmcts/one-per-page');
// const content = require('./content');
const urls = require('urls');

class Representative extends Question {

    get url() {
        return '/representative';
        return urls.representative.representative
    }

    get template() {
        return `representative/representative/template`;
    }

    // get i18NextContent() {
    //     return content;
    // }

    get form() {}

    next() {
        return goTo(undefined); // To define the next step
    }
}

module.exports = Representative;
