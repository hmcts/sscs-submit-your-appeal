'use strict';

function enterMobileAndContinue(mobileNumber) {

    const I = this;

    I.fillField('enterMobile', mobileNumber);
    I.click('Continue');
}

module.exports = { enterMobileAndContinue };

