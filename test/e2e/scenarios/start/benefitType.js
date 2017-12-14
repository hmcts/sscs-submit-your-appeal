'use strict';

const paths = require('paths');
const types = require('steps/start/benefit-type/types');

Feature('Benefit Type');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});


Scenario('When I enter PIP, I am taken to the postcode-check page', (I) => {

    I.enterBenefitTypeAndContinue('Personal Independence Payment (PIP)');
    I.seeInCurrentUrl(paths.start.postcodeCheck);

});

Scenario('When I enter a non PIP benefit type, I am taken to the download form page', (I) => {

    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);

});

Scenario('When I enter differernt non PIP benefit types, I am taken to the download form page', (I) => {
    let i;
    for(i=0; i<types.length; i++){
        if(types[i]!='Personal Independence Payment (PIP)'){
            I.enterBenefitTypeAndContinue(types[i]);
            I.see(types[i]);
            I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
            I.see('Continue to form download');
            I.click('Back'); //click on Back link
        }
    }
});

Scenario('Check the Benefit form, I am taken to the download form page', (I) => {
    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
    I.click('Continue to form download'); //Continue to form download
    I.seeInCurrentUrl("https://hmctsformfinder.justice.gov.uk/HMCTS/GetForm.do?original_id=3038");
});
