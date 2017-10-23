'use strict';

const { EntryPoint, goTo } = require('@hmcts/one-per-page');
const urls = require('urls');

class Entry extends EntryPoint {

    get url() {
        return urls.session.entry;
    }

    next() {
        return goTo(this.journey.BenefitType);
    }
}

module.exports = Entry;
