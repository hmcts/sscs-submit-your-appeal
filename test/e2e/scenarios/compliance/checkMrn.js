'use strict';

const urls = require('urls');
const moment = require('moment');

Feature('Check MRN');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.mrnDate);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select yes and mrnDate is > 1 month and <= 13 months, I am taken to the mrn over one month late page', (I) => {

    const mrnDate = moment().subtract(2, 'months');
    I.goToCheckMrnPage(mrnDate);
    I.goToCorrectPageAfterCheckMRN('yes', urls.compliance.mrnOverMonthLate);

});

Scenario('When I select yes and mrnDate is > 13 months, I am taken to the mrn over thirteen month late page', (I) => {

    const mrnDate = moment().subtract(14, 'months');
    I.goToCheckMrnPage(mrnDate);
    I.goToCorrectPageAfterCheckMRN('yes', urls.compliance.mrnOverThirteenMonthsLate);

});

Scenario('When I select no, I am taken to the mrn date page', (I) => {

    const mrnDate = moment().subtract(2, 'months');
    I.goToCheckMrnPage(mrnDate);
    I.goToCorrectPageAfterCheckMRN('no', urls.compliance.mrnDate);

});
