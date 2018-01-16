'use strict';

function selectHearingAvailabilityAndContinue(option) {

    const I = this;

    I.checkOption(option);
    I.click('Continue');
}

module.exports = { selectHearingAvailabilityAndContinue };
