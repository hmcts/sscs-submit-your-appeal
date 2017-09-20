const { goTo, EntryPoint } = require('@hmcts/one-per-page');

class Entry extends EntryPoint {

    get url() {
        return '/';
    }

    next() {
        return goTo(this.journey.BenefitsType);
    }
}

module.exports = Entry;
