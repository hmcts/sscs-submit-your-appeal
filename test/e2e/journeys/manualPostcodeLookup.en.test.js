/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Postcode lookup test for type Manual`);

Before(({ I }) => {
  I.createTheSession(language);
  I.retry({ retries: 3, minTimeout: 2000 }).seeCurrentUrlEquals(paths.start.benefitType);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant enters contact details Manually`, ({ I }) => {
  I.amOnPage(paths.session.root);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToEnd(commonContent);
  I.skipPcq();
  I.confirmDetailsArePresent(language);
}).retry(1);
