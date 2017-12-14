'use strict';

const paths = require('paths');
const content = require('steps/compliance/have-a-mrn/content.en.json');

Feature('Check MRN');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.compliance.haveAMRN);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select yes I am taken to the DWP Issuing office page', (I) => {

    I.selectHaveYouGotAMRNAndContinue('Yes, I have a Mandatory Reconsideration Notice (MRN)');
    I.seeInCurrentUrl(paths.compliance.dwpIssuingOffice);

});

Scenario('When I select no I am taken to the have you contacted DWP page', (I) => {

    I.selectHaveYouGotAMRNAndContinue('No, I don’t have a Mandatory Reconsideration Notice (MRN)');
    I.seeInCurrentUrl(paths.compliance.haveContactedDWP);

});

Scenario('When I click continue without selecting an option, I see an error', (I) => {

    I.click('Continue');
    I.seeInCurrentUrl(paths.compliance.haveAMRN);
    I.see(content.fields.haveAMRN.error.required);

});
