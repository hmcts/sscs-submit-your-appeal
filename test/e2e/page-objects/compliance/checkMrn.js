'use strict';

const urls = require('urls');

function goToCheckMrnPage(mrnDate) {

    const I = this;

    I.fillField('#MRNDate_day', mrnDate.date());
    I.fillField('#MRNDate_month', mrnDate.month() + 1);
    I.fillField('#MRNDate_year', mrnDate.year());
    I.click('Continue');
    I.seeInCurrentUrl(urls.compliance.checkMRNDate);

}

function goToCorrectPageAfterCheckMRN(value, url) {

    const I = this;

    I.checkOption(`#CheckMRN_checkedMRN-${value}`);
    I.click('Continue');
    I.seeInCurrentUrl(url);

}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };
