const content = require('commonContent');
const textRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const textRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Send to number @batch-11');

languages.forEach(language => {
  const commonContent = content[language];
  const textRemindersContent = language === 'en' ? textRemindersContentEn : textRemindersContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.identity.enterAppellantContactDetails);
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07466748336');
    I.seeInCurrentUrl(paths.smsNotify.appellantTextReminders);
    I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.click(commonContent.continue);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the sms confirmation page`, I => {
    I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-yes');
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  });

  Scenario(`${language.toUpperCase()} - When I select No, I am taken to the enter mobile page`, I => {
    I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-no');
    I.seeInCurrentUrl(paths.smsNotify.enterMobile);
  });
});
