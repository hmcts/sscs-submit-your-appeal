/* eslint-disable no-process-env */

const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const config = require('config');

const testConfig = config.get('e2e.retry');

Feature(`${language.toUpperCase()} - Postcode lookup test for type Manual @functional`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant enters contact details Manually`, ({ I }) => {
  I.amOnPage(paths.session.root);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToEnd(language, commonContent);
  I.skipPcqCY();
  I.confirmDetailsArePresent(language);
}).retry(testConfig.retry);
