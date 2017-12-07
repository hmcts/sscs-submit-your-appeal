'use strict';

const paths = require('paths');

Feature('Benefit Type');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter PIP, I am taken to the DWP Issuing office page', (I) => {

    I.enterBenefitTypeAndContinue('Personal Independence Payment (PIP)');
    I.seeInCurrentUrl(paths.compliance.dwpIssuingOffice);

});

Scenario('When I enter a non PIP benefit type, I am taken to the download form page', (I) => {

    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);

});
