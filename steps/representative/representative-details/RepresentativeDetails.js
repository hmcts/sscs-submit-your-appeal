const { Question } = require('@hmcts/one-per-page');
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
    
    next() {}
}

module.exports = RepresentativeDetails;
