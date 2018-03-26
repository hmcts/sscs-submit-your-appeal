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

    I.fillField('input[name="nameOrganisation.firstName"]', 'H');
    I.fillField('input[name="nameOrganisation.lastName"]', 'P');
    I.click('Continue');
    I.see(representative.nameOrganisation.firstName.error.invalid);
    I.see(representative.nameOrganisation.lastName.error.invalid);

});

Scenario('When I click continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(representative.nameOrganisation.error.required);
    I.see(representative.addressLine1.error.required);
    I.see(representative.townCity.error.required);
    I.see(representative.county.error.required);
    I.see(representative.postCode.error.required);

});

Scenario('When I click continue without entering a name or organisation, I see errors', (I) => {

    I.click('Continue');
    I.see(representative.nameOrganisation.error.required);

});

Scenario('When I enter a name and continue, I don\'t see errors', (I) => {

    I.fillField('input[name="nameOrganisation.firstName"]', 'Harry');
    I.click('Continue');
    I.dontSee(representative.nameOrganisation.error.required);

});

Scenario('When I enter an organisation and continue, I don\'t see errors', (I) => {

    I.fillField('input[name="nameOrganisation.organisation"]', 'Hogwarts');
    I.click('Continue');
    I.dontSee(representative.nameOrganisation.error.required);

});
