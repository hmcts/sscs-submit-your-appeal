const content = require('commonContent');
const haveContactedDWPContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const haveContactedDWPContentCy = require('steps/compliance/have-contacted-dwp/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Have Contacted DWP @batch-07');

languages.forEach(language => {
  const commonContent = content[language];
  const haveContactedDWPContent = language === 'en' ? haveContactedDWPContentEn : haveContactedDWPContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.haveContactedDWP);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select yes I am taken to the No MRN page`, I => {
    I.selectHaveYouContactedDWPAndContinue(commonContent, '#haveContactedDWP-yes');
    I.seeInCurrentUrl(paths.compliance.noMRN);
  });

  Scenario(`${language.toUpperCase()} - When I select no I am taken to the contact DWP page`, I => {
    I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveContactedDWP-no');
    I.seeInCurrentUrl(paths.compliance.contactDWP);
  });

  Scenario(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, I => {
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.compliance.haveContactedDWP);
    I.see(haveContactedDWPContent.fields.haveContactedDWP.error.required);
  });
});
