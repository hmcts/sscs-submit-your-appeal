const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Not Attending Hearing @batch-08`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.hearing.notAttendingHearing);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I click Continue, I am taken to the check your appeal page`, ({ I }) => {
  I.continueFromnotAttendingHearing(commonContent);
  I.seeInCurrentUrl(paths.checkYourAppeal);
});
