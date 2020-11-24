/* eslint-disable no-process-env */

const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const config = require('config');

const aatUrl = 'https://benefit-appeal.aat.platform.hmcts.net';
const actUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

Feature(`${language.toUpperCase()} - Postcode lookup test for type Manual @fullFunctional`);

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
  if (actUrl === aatUrl) I.completePcq();
  I.confirmDetailsArePresent(language);
}).retry(1);
