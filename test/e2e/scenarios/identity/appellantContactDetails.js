const appellant = require('steps/identity/appellant-contact-details/content.en').fields;
const paths = require('paths');

Feature('Appellant details form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and click Continue, I am taken to the Text reminders page', (I) => {

    I.fillField('addressLine1', '4 Privet Drive');
    I.fillField('addressLine2', 'Off Wizards close');
    I.fillField('townCity', 'Little Whinging');
    I.fillField('county', 'Kent');
    I.fillField('postCode', 'PA80 5UU');
    I.fillField('phoneNumber', '07466748336');
    I.fillField('emailAddress', 'harrypotter@wizards.com');
    I.click('Continue');
    I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);

});

Scenario('When I click Continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(appellant.addressLine1.error.required);
    I.see(appellant.townCity.error.required);
    I.see(appellant.postCode.error.required);

});
