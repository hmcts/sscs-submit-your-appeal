/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const paths = require('paths');

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional-100`,  I => {
  moment().locale(language);

  I.enterDetailsFromStartToDraftAppeals(commonContent, language);
  // I.enterAppellantContactDetailsAndContinue(commonContent, language);
  // I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  // I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  // await I.enterDetailsFromAttendingTheHearingToEnd(commonContent, language, randomWeekDay);
  // I.confirmDetailsArePresent(language);
  // I.see(DateUtils.formatDate(randomWeekDay, 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);