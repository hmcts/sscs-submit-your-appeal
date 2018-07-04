const paths = require('paths');
const representative = require('steps/representative/representative-details/content.en').fields;

Feature('Representative Details @batch-10');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.representative.representativeDetails);
});

After(I => {
  I.endTheSession();
});

Scenario('After completing the form I am taken to the /reasons-for-appealing page', I => {
  I.enterRequiredRepresentativeDetails();
  I.click('Continue');
  I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
});

Scenario('When I only provide a single character for firstName and lastName I see errors', I => {
  I.fillField('input[name="name.first"]', 'H');
  I.fillField('input[name="name.last"]', 'P');
  I.click('Continue');
  I.see(representative.name.first.error.invalid);
  I.see(representative.name.last.error.invalid);
});

Scenario('When I click continue without filling in the fields I see errors', I => {
  I.click('Continue');
  I.see(representative.name.error.required);
  I.see(representative.addressLine1.error.required);
  I.see(representative.townCity.error.required);
  I.see(representative.county.error.required);
  I.see(representative.postCode.error.required);
});

Scenario('When I click continue without entering a name or organisation, I see errors', I => {
  I.click('Continue');
  I.see(representative.name.error.required);
});

Scenario('When I enter a name and continue, I do not see errors', I => {
  I.fillField('input[name="name.first"]', 'Harry');
  I.click('Continue');
  I.dontSee(representative.name.error.required);
});

Scenario('When I enter an organisation and continue, I do not see errors', I => {
  I.fillField('input[name="name.organisation"]', 'Hogwarts');
  I.click('Continue');
  I.dontSee(representative.name.error.required);
});
