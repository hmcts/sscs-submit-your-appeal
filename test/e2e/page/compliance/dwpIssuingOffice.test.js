const content = require('commonContent');
const dwpIssuingOfficeContentEn = require('steps/compliance/dwp-issuing-office/content.en');
const dwpIssuingOfficeContentCy = require('steps/compliance/dwp-issuing-office/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('DWP Issuing Office @batch-07');

languages.forEach(language => {
  const commonContent = content[language];
  const dwpIssuingOfficeContent = language === 'en' ? dwpIssuingOfficeContentEn : dwpIssuingOfficeContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.dwpIssuingOffice);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I enter a valid issuing office, I am taken to the mrn date page`, I => {
    I.enterDWPIssuingOfficeAndContinue(commonContent, '1');
    I.seeInCurrentUrl(paths.compliance.mrnDate);
  });

  Scenario(`${language.toUpperCase()} - When I click continue without adding a dwp issuing office I see an error`, I => {
    I.click(commonContent.continue);
    I.seeDWPIssuingOfficeError(paths.compliance.dwpIssuingOffice, dwpIssuingOfficeContent.fields.pipNumber.error.required);
  });
});
