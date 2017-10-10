const { Question, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class NoRepresentativeDetails extends Question {

    get url() {
        return urls.representative.noRepresentativeDetails;
    }

    get form() {
    }

    next() {
        return goTo(this.journey.ReasonForAppealing);
    }
}

module.exports = NoRepresentativeDetails;
