const appointee = require('steps/identity/appointee/content.en').fields.appointee;
const appellant = require('steps/identity/appellant-details/content.en').fields;
const urls = require('urls');

Feature('Appellant details form');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.identity.enterAppellantDetails);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and click Continue, I am taken to the Text reminders page', (I) => {

    I.fillField('AppellantDetails_firstName', 'Harry');
    I.fillField('AppellantDetails_lastName', 'Potter');
    I.fillField('AppellantDetails_niNumber', 'AB123456C');
    I.fillField('AppellantDetails_addressLine1', '4 Privet Drive');
    I.fillField('AppellantDetails_addressLine2', 'Off Wizards close');
    I.fillField('AppellantDetails_townCity', 'Little Whinging');
    I.fillField('AppellantDetails_postCode', 'PA80 5UU');
    I.fillField('AppellantDetails_phoneNumber', '07466748336');
    I.fillField('AppellantDetails_emailAddress', 'harrypotter@wizards.com');
    I.click('Continue');
    I.seeCurrentUrlEquals(urls.smsNotify.appellantTextReminders);

});

Scenario('When I click Continue without filling in the fields I see errors', (I) => {

    I.click('Continue');
    I.see(appellant.firstName.error.required);
    I.see(appellant.lastName.error.required);
    I.see(appellant.niNumber.error.required);
    I.see(appellant.addressLine1.error.required);
    I.see(appellant.addressLine2.error.required);
    I.see(appellant.townCity.error.required);
    I.see(appellant.postCode.error.required);

});
