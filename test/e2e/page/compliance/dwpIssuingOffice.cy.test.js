const language = 'cy';
const commonContent = require('commonContent')[language];
const dwpIssuingOfficeContent = require(`steps/compliance/dwp-issuing-office/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - DWP Issuing Office @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.dwpIssuingOffice);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I enter a valid issuing office, I am taken to the mrn date page`, ({ I }) => {
  I.enterDWPIssuingOfficeAndContinue(commonContent, '1');
  I.seeInCurrentUrl(paths.compliance.mrnDate);
});

Scenario(`${language.toUpperCase()} - When I click continue without adding a dwp issuing office I see an error`, ({ I }) => {
  I.click(commonContent.continue);
  I.seeDWPIssuingOfficeError(paths.compliance.dwpIssuingOffice, dwpIssuingOfficeContent.fields.pipNumber.error.required);
});
