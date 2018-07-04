const appellantContent = require('steps/identity/appellant-contact-details/content.en').fields;
const paths = require('paths');
const config = require('config');

const appellant = require('test/e2e/data').appellant;

Feature('Appellant details form @batch-09');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(I => {
  I.endTheSession();
});

Scenario('When completing the form, clicking Continue, I see url /appellant-text-reminders', I => {
  I.fillField('addressLine1', appellant.contactDetails.addressLine1);
  I.fillField('addressLine2', appellant.contactDetails.addressLine2);
  I.fillField('townCity', appellant.contactDetails.townCity);
  I.fillField('county', appellant.contactDetails.county);
  I.fillField('postCode', appellant.contactDetails.postCode);
  I.fillField('phoneNumber', appellant.contactDetails.phoneNumber);
  I.fillField('emailAddress', appellant.contactDetails.emailAddress);
  I.click('Continue');
  I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);
});

Scenario('When I click Continue without completing the form I see errors', I => {
  I.click('Continue');
  I.see(appellantContent.addressLine1.error.required);
  I.see(appellantContent.townCity.error.required);
  I.see(appellantContent.county.error.required);
  I.see(appellantContent.postCode.error.required);
});

Scenario('When I click Continue with a postcode that is not in England or Wales I see error', I => {
  if (config.get('postcodeChecker.enabled')) {
    I.fillField('addressLine1', appellant.contactDetails.addressLine1);
    I.fillField('addressLine2', appellant.contactDetails.addressLine2);
    I.fillField('townCity', appellant.contactDetails.townCity);
    I.fillField('county', appellant.contactDetails.county);
    I.fillField('postCode', 'ZX99 1AB');
    I.fillField('phoneNumber', appellant.contactDetails.phoneNumber);
    I.fillField('emailAddress', appellant.contactDetails.emailAddress);
    I.click('Continue');

    I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);
  }
});
