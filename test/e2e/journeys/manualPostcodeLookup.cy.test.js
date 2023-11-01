/* eslint-disable no-process-env */

const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Postcode lookup test for type Manual @functional`);

Before(({ I }) => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
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
  I.confirmDetailsArePresent(language);
}).retry(10);
