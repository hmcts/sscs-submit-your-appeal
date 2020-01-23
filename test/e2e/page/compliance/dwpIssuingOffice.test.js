const paths = require('paths');
const content = require('steps/compliance/dwp-issuing-office/content.en.json');

Feature('DWP Issuing Office @batch-07');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.compliance.dwpIssuingOffice);
});

After(I => {
  I.endTheSession();
});

Scenario('When I enter a valid issuing office, I am taken to the mrn date page', I => {
  I.enterDWPIssuingOfficeAndContinue('1');
  I.seeInCurrentUrl(paths.compliance.mrnDate);
});

Scenario('When I click continue without adding a dwp issuing office I see an error', I => {
  I.click('Continue');
  I.seeDWPIssuingOfficeError(paths.compliance.dwpIssuingOffice,
    content.fields.pipNumber.error.required);
});
