'use strict';

const urls = require('urls');

Feature('MRN Over one month late');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.mrnOverMonthLate);
});

After((I) => {
    I.endTheSession();
});

Scenario.only('When I enter a reason for lateness and click continue, I am taken to the no mrn page', (I) => {

    console.log('hello')
    I.goToCorrectPageWhenReasonProvided();

});

Scenario('When I click I don\'t have a good reason, I am taken to the cant appeal page', (I) => {

    I.goToCorrectPageWhenNoReasonIsClicked();

});
