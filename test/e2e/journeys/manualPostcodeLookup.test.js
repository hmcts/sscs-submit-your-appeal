const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Postcode lookup test for type  Manual @functional');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
    I.seeCurrentUrlEquals(paths.start.benefitType);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;

  Scenario(`${language.toUpperCase()} - Appellant enters contact details Manually`, I => {
    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
    I.checkOptionAndContinue(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd(commonContent, language);
    I.confirmDetailsArePresent(language);
  }).retry(1);
});
