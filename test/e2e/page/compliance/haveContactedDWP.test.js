const paths = require('paths');
const content = require('steps/compliance/have-contacted-dwp/content.en.json');

Feature('Have Contacted DWP @batch-07');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.compliance.haveContactedDWP);
});

After(I => {
  I.endTheSession();
});

Scenario('When I select yes I am taken to the No MRN page', I => {
  I.selectHaveYouContactedDWPAndContinue('Yes, I’ve contacted DWP about the decision');
  I.seeInCurrentUrl(paths.compliance.noMRN);
});

Scenario('When I select no I am taken to the contact DWP page', I => {
  I.selectHaveYouGotAMRNAndContinue('No, I haven’t contacted DWP about the decision');
  I.seeInCurrentUrl(paths.compliance.contactDWP);
});

Scenario('When I click continue without selecting an option, I see an error', I => {
  I.click('Continue');
  I.seeInCurrentUrl(paths.compliance.haveContactedDWP);
  I.see(content.fields.haveContactedDWP.error.required);
});
