'use strict';

const urls = require('urls');

Feature('MRN Over thirteen months late');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.mrnOverThirteenMonthsLate);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter a reason for lateness and click continue, I am taken to the are-you-an-appointee page', (I) => {

    I.goToCorrectPageWhenReasonProvided();

});

Scenario('When I click I don\'t have a good reason, I am taken to the cant appeal page', (I) => {

    I.goToCorrectPageWhenNoReasonIsClicked();

});
