'use strict';

const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const paths = require('paths');

class Independence extends Interstitial {

    static get path() {

        return paths.start.independence;
    }

    next() {

        return goTo(this.journey.steps.HaveAMRN);
    }
}

module.exports = Independence;
