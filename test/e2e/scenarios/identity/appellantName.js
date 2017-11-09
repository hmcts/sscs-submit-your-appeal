const appellant = require('steps/identity/appellant-name/content.en').fields;
const paths = require('paths');

Feature('Appellant Name form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantName);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and click Continue, I am taken to the Appellant DOB page', (I) => {

    I.fillField('AppellantName_title', 'Mr');
    I.fillField('AppellantName_firstName', 'Harry');
    I.fillField('AppellantName_lastName', 'Potter');
    I.click('Continue');
    I.seeCurrentUrlEquals(paths.identity.enterAppellantDOB);

});

Scenario('When I click Continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(appellant.title.error.required);
    I.see(appellant.firstName.error.required);
    I.see(appellant.lastName.error.required);

});
