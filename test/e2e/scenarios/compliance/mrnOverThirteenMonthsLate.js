'use strict';

const urls = require('urls');
const content = require('steps/compliance/mrn-over-month-late/content.en.json');

Feature('MRN Over thirteen months late');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.mrnOverThirteenMonthsLate);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter a reason for lateness and click continue, I am taken to the are-you-an-appointee page', (I) => {

    I.fillField('#MRNOverThirteenMonthsLate_reasonForBeingLate', 'Late');
    I.click('input[type="submit"]');
    I.seeInCurrentUrl(urls.identity.areYouAnAppointee);

});

Scenario('When I click I don\'t have a good reason, I am taken to the cant appeal page', (I) => {

    I.click(content.noGoodReasonWhyLate);
    I.seeInCurrentUrl(urls.compliance.cantAppeal);

});

Scenario('When I have an MRN that is over thirteen months late, I do not enter a reason why my appeal is late, I see errors', (I) => {

    I.click('Continue');
    I.seeCurrentUrlEquals(urls.compliance.mrnOverThirteenMonthsLate);
    I.see(content.fields.reasonForBeingLate.error.required);

});
