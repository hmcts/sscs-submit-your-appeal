const content = require('commonContent');
const textRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const textRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Text Reminders - appellant contact details @batch-11');

languages.forEach(language => {
  const commonContent = content[language];
  const textRemindersContent = language === 'en' ? textRemindersContentEn : textRemindersContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.identity.enterAppellantContactDetails);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario('Enter mobile and click Sign up, I am taken to the send to number page', I => {
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language);
    I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.smsNotify.sendToNumber);
  });

  Scenario('Enter mobile and click do not sign up, I am taken to the representative page', I => {
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language);
    I.click(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.representative.representative);
  });

  Scenario('Do not enter mobile and click Sign up, I am taken to the enter mobile page', I => {
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.smsNotify.enterMobile);
  });
});
