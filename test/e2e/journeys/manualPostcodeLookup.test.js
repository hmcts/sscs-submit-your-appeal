const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Postcode lookup test for type  Manual');

languages.forEach(language => {
  const commonContent = content[language];

  Before(I => {
    I.createTheSession(language);
    I.seeCurrentUrlEquals(paths.start.benefitType);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - Appellant enters contact details Manually`, I => {
    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
    I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
  }).retry(1);
});
