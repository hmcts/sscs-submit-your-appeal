const language = 'cy';
const commonContent = require('commonContent')[language];
const haveContactedDWPContent = require(`steps/compliance/have-contacted-dwp/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Have Contacted DWP @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.haveContactedDWP);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I select yes I am taken to the No MRN page`, ({ I }) => {
  I.selectHaveYouContactedDWPAndContinue(language, commonContent, '#haveContactedDWP-yes');
  I.seeInCurrentUrl(paths.compliance.noMRN);
});

Scenario(`${language.toUpperCase()} - When I select no I am taken to the contact DWP page`, ({ I }) => {
  I.selectHaveYouGotAMRNAndContinue(language, commonContent, '#haveContactedDWP-no');
  I.seeInCurrentUrl(paths.compliance.contactDWP);
});

Scenario(`${language.toUpperCase()} - When I click continue without selecting an option, I see an error`, ({ I }) => {
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.compliance.haveContactedDWP);
  I.see(haveContactedDWPContent.fields.haveContactedDWP.error.required);
});
