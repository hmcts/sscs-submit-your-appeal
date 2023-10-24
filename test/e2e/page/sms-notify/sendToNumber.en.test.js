const language = 'en';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Send to number @batch-11`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantContactDetails);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07466748336');
  I.seeInCurrentUrl(paths.smsNotify.appellantTextReminders);
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click(commonContent.continue);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the sms confirmation page`, ({ I }) => {
  I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-yes');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
});

Scenario(`${language.toUpperCase()} - When I select No, I am taken to the enter mobile page`, ({ I }) => {
  I.selectUseSameNumberAndContinue(commonContent, '#useSameNumber-no');
  I.seeInCurrentUrl(paths.smsNotify.enterMobile);
});
