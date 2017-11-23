'use strict';

const paths = require('paths');

function goToCheckMrnPage(mrnDate) {

    const I = this;

    I.fillField('#day', mrnDate.date());
    I.fillField('#month', mrnDate.month() + 1);
    I.fillField('#year', mrnDate.year());
    I.click('Continue');
    I.seeInCurrentUrl(paths.compliance.checkMRNDate);

}

function goToCorrectPageAfterCheckMRN(value, url) {

    const I = this;

    I.checkOption(`#checkedMRN-${value}`);
    I.click('Continue');
    I.seeInCurrentUrl(url);

}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };
