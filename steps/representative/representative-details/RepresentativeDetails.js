const { Question } = require('@hmcts/one-per-page');
const urls = require('urls');

class RepresentativeDetails extends Question {

    get url() {
        return urls.representative.representativeDetails;
    }

    get form() {}
    
    next() {}
}

module.exports = RepresentativeDetails;
