const appellantContent = require('steps/identity/appellant-contact-details/content.en').fields;
const paths = require('paths');

const appellant = require('test/e2e/data').appellant;

Feature('Appellant details form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and click Continue, I am taken to the Text reminders page', (I) => {

    I.fillField('addressLine1', appellant.contactDetails.addressLine1);
    I.fillField('addressLine2', appellant.contactDetails.addressLine2);
    I.fillField('townCity',     appellant.contactDetails.townCity);
    I.fillField('county',       appellant.contactDetails.county);
    I.fillField('postCode',     appellant.contactDetails.postCode);
    I.fillField('phoneNumber',  appellant.contactDetails.phoneNumber);
    I.fillField('emailAddress', appellant.contactDetails.emailAddress);
    I.click('Continue');
    I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);

});

Scenario('When I click Continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(appellantContent.addressLine1.error.required);
    I.see(appellantContent.townCity.error.required);
    I.see(appellantContent.county.error.required);
    I.see(appellantContent.postCode.error.required);

});
