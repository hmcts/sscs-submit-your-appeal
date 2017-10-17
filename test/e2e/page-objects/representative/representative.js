'use strict';

function selectDoYouHaveARepresentativeAndContinue(option) {

    const I = this;

    I.checkOption(option);
    I.click('Continue');
}

module.exports = { selectDoYouHaveARepresentativeAndContinue };
