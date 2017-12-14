'use strict';

const content = require('steps/identity/appellant-name/content.en.json');
const paths = require('paths');

Feature('Appointee form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.areYouAnAppointee);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select Yes, I am taken to the download appointee form page', (I) => {

    I.selectAreYouAnAppointeeAndContinue('Yes');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
    I.see('You need to download and fill out a paper form');

});

Scenario('When I select No, I am taken to the enter your details page', (I) => {

    I.selectAreYouAnAppointeeAndContinue('No');
    I.seeInCurrentUrl(paths.identity.enterAppellantName);
    I.see(content.titleNoAppointee);

});
