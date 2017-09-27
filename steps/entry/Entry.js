const { goTo, EntryPoint } = require('@hmcts/one-per-page');
const urls = require('urls');

class Entry extends EntryPoint {

    get url() {
        return urls.session.entry;
    }

    next() {
        return goTo(this.journey.BenefitsType);
    }
}

module.exports = Entry;
