'use strict';

const independence = require('steps/start/independence/content.en.json');
const appealFormDownload = require('steps/appeal-form-download/content.en.json');
const appointee = require('steps/identity/appointee/content.en');
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

    I.selectAreYouAnAppointeeAndContinue(appointee.fields.isAppointee.yes);
    I.seeInCurrentUrl(paths.appealFormDownload);
    I.see(appealFormDownload.title);

});

Scenario('When I select No, I am taken to the independence page', (I) => {

    I.selectAreYouAnAppointeeAndContinue(appointee.fields.isAppointee.no);
    I.seeInCurrentUrl(paths.start.independence);
    I.see(independence.title);

});
