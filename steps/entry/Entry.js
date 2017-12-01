'use strict';

const { EntryPoint, goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class Entry extends EntryPoint {

    static get path() {

        return paths.session.entry;
    }

    next() {

        return goTo(this.journey.steps.BenefitType);
    }
}

module.exports = Entry;
