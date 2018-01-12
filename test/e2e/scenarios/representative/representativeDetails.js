'use strict';

const paths = require('paths');
const representative = require('steps/representative/representative-details/content.en.json').fields;

Feature('Representative Details');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.representative.representativeDetails)
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and continue, I am taken to the reason for appealing page', (I) => {

    I.enterRequiredRepresentativeDetails();
    I.click('Continue');
    I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);

});

Scenario('When I only provide a single character for firstName and lastName I see errors', (I) => {

    I.fillField('#firstName', 'H');
    I.fillField('#lastName', 'P');
    I.click('Continue');
    I.see(representative.firstName.error.invalid);
    I.see(representative.lastName.error.invalid);

});

Scenario('When I click continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(representative.firstName.error.required);
    I.see(representative.lastName.error.required);
    I.see(representative.addressLine1.error.required);
    I.see(representative.townCity.error.required);
    I.see(representative.county.error.required);
    I.see(representative.postCode.error.required);

});
