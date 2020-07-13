const content = require('commonContent');
const haveAMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveAMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Check MRN @batch-07');

languages.forEach(language => {
  const commonContent = content[language];
  const haveAMRNContent = language === 'en' ? haveAMRNContentEn : haveAMRNContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.haveAMRN);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select yes I am taken to the DWP Issuing office page`, I => {
    I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveAMRN-yes');
    I.seeInCurrentUrl(paths.compliance.dwpIssuingOffice);
  });

  Scenario(`${language.toUpperCase()} - When I select no I am taken to the have you contacted DWP page`, I => {
    I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveAMRN-no');
    I.seeInCurrentUrl(paths.compliance.haveContactedDWP);
  });

  Scenario(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, I => {
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.compliance.haveAMRN);
    I.see(haveAMRNContent.fields.haveAMRN.error.required);
  });
});
