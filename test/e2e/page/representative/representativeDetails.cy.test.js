const language = 'cy';
const commonContent = require('commonContent')[language];
const representativeDetailsContent = require(`steps/representative/representative-details/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Representative Details @batch-10`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.representative.representativeDetails);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - After completing the form I am taken to the /reasons-for-appealing page`, ({ I }) => {
  I.enterRequiredRepresentativeDetails();
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
});

Scenario(`${language.toUpperCase()} - When I only provide a single character for firstName and lastName I see errors`, ({ I }) => {
  I.fillField('input[name="name.first"]', 'H');
  I.fillField('input[name="name.last"]', 'P');
  I.click(commonContent.continue);
  I.see(representativeDetailsContent.fields.name.first.error.invalid);
  I.see(representativeDetailsContent.fields.name.last.error.invalid);
});

Scenario(`${language.toUpperCase()} - When I click continue without filling in the fields I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(representativeDetailsContent.fields.name.error.required);
  I.see(representativeDetailsContent.fields.addressLine1.error.required);
  I.see(representativeDetailsContent.fields.townCity.error.required);
  I.see(representativeDetailsContent.fields.county.error.required);
  I.see(representativeDetailsContent.fields.postCode.error.required);
});

Scenario(`${language.toUpperCase()} - When I click continue without entering a name or organisation, I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(representativeDetailsContent.fields.name.error.required);
});

Scenario(`${language.toUpperCase()} - When I enter a name and continue, I do not see errors`, ({ I }) => {
  I.fillField('input[name="name.first"]', 'Harry');
  I.click(commonContent.continue);
  I.dontSee(representativeDetailsContent.fields.name.error.required);
});

Scenario(`${language.toUpperCase()} - When I enter a name with special characters and continue, I do not see errors`, ({ I }) => {
  I.fillField('input[name="name.first"]', 'André-Ottö');
  I.click(commonContent.continue);
  I.dontSee(representativeDetailsContent.fields.name.error.required);
});

Scenario(`${language.toUpperCase()} - When I enter an organisation and continue, I do not see errors`, ({ I }) => {
  I.fillField('input[name="name.organisation"]', 'Hogwarts');
  I.click(commonContent.continue);
  I.dontSee(representativeDetailsContent.fields.name.error.required);
});
