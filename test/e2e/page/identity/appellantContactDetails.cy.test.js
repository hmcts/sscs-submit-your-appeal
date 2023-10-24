const language = 'cy';
const commonContent = require('commonContent')[language];
const appellantContactDetailsContent = require(`steps/identity/appellant-contact-details/content.${language}`);
const paths = require('paths');
const config = require('config');

const appellant = require('test/e2e/data.en').appellant;

Feature(`${language.toUpperCase()} - Appellant details form @batch-09`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When completing the form, clicking Continue, I see url /appellant-text-reminders`, ({ I }) => {
  I.fillField('addressLine1', appellant.contactDetails.addressLine1);
  I.fillField('addressLine2', appellant.contactDetails.addressLine2);
  I.fillField('townCity', appellant.contactDetails.townCity);
  I.fillField('county', appellant.contactDetails.county);
  I.fillField('postCode', appellant.contactDetails.postCode);
  I.fillField('phoneNumber', appellant.contactDetails.phoneNumber);
  I.fillField('emailAddress', appellant.contactDetails.emailAddress);
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);
});

Scenario(`${language.toUpperCase()} - When I click Continue without completing the form I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(appellantContactDetailsContent.fields.addressLine1.error.required);
  I.see(appellantContactDetailsContent.fields.townCity.error.required);
  I.see(appellantContactDetailsContent.fields.county.error.required);
  I.see(appellantContactDetailsContent.fields.postCode.error.required);
});

Scenario(`${language.toUpperCase()} - When I click Continue with a postcode that is not in England or Wales I see error`, ({ I }) => {
  if (config.get('postcodeChecker.enabled')) {
    I.fillField('addressLine1', appellant.contactDetails.addressLine1);
    I.fillField('addressLine2', appellant.contactDetails.addressLine2);
    I.fillField('townCity', appellant.contactDetails.townCity);
    I.fillField('county', appellant.contactDetails.county);
    I.fillField('postCode', 'ZX99 1AB');
    I.fillField('phoneNumber', appellant.contactDetails.phoneNumber);
    I.fillField('emailAddress', appellant.contactDetails.emailAddress);
    I.click(commonContent.continue);

    I.seeCurrentUrlEquals(paths.smsNotify.appellantTextReminders);
  }
});

Scenario(`${language.toUpperCase()} - I have a csrf token`, ({ I }) => {
  I.seeElementInDOM('form input[name="_csrf"]');
});
