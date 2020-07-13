const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Not Attending Hearing @batch-08');

languages.forEach(language => {
  const commonContent = content[language];

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.hearing.notAttendingHearing);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I click Continue, I am taken to the check your appeal page`, I => {
    I.continueFromnotAttendingHearing(commonContent);
    I.seeInCurrentUrl(paths.checkYourAppeal);
  });
});
