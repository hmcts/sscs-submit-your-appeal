'use strict';

function checkOptionAndContinue(option) {

    const I = this;

    I.checkOption(option);
    I.click('Continue');
}

module.exports = { checkOptionAndContinue };
