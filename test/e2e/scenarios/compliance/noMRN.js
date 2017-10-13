'use strict';

const content = require('steps/compliance/no-mrn/content.en');
const urls = require('urls');

Feature('User does not have an MRN');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.noMRN)
});

After((I) => {
    I.endTheSession();
});


Scenario('When I do not have an MRN and have not contacted DWP, I am taken to the contact DWP page', (I) => {

    I.click(content.haveNotContactedDWP);
    I.seeCurrentUrlEquals(urls.compliance.contactDWP);

});

Scenario('When I do not have an MRN and have entered a reason why, I am taken to the appointee page', (I) => {

    I.fillField('#NoMRN_reasonForNoMRN', 'I do not have an MRN because...');
    I.click('Continue');
    I.seeCurrentUrlEquals(urls.identity.areYouAnAppointee);

});

Scenario('When I do not have an MRN, I have not entered anything, I see errors', (I) => {

    I.click('Continue');
    I.seeCurrentUrlEquals(urls.compliance.noMRN);
    I.see(content.fields.reasonForNoMRN.error.required);

});
