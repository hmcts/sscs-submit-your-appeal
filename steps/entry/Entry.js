'use strict';

const { EntryPoint, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class Entry extends EntryPoint {

    get url() {
        return paths.session.entry;
    }

    next() {
        return goTo(this.journey.BenefitType);
    }
}

module.exports = Entry;
