const paths = require('paths');
const smsConfirmationContent = require('steps/sms-notify/sms-confirmation/content.en');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');

Feature('SMS Confirmation - appellant contact details @batch-11');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});

After(I => {
  I.endTheSession();
});

Scenario('When I click Continue, I am taken to the Representative page', I => {
  I.enterAppellantContactDetailsWithMobileAndContinue();
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.selectUseSameNumberAndContinue('#useSameNumber-yes');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.click('Continue');
  I.seeInCurrentUrl(paths.representative.representative);
});

Scenario('Enter a mobile and click use same number, I see the number in SMS confirmation', I => {
  I.enterAppellantContactDetailsWithMobileAndContinue('07466748336');
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.selectUseSameNumberAndContinue('#useSameNumber-yes');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}07466748336`);
});

Scenario('Enter a mobile, click use different number, I see enter mobile number', I => {
  I.enterAppellantContactDetailsWithMobileAndContinue('07466748336');
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.selectUseSameNumberAndContinue('#useSameNumber-no');
  I.seeInCurrentUrl(paths.smsNotify.enterMobile);
  I.fillField('#enterMobile', '+447123456789');
  I.click('Continue');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}+447123456789`);
});

Scenario('Do not enter a mobile, I see the mobile number I provided for enter mobile', I => {
  I.enterAppellantContactDetailsAndContinue();
  I.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.click('Continue');
  I.fillField('#enterMobile', '+447987654321');
  I.click('Continue');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  I.see(`${smsConfirmationContent.mobileNumber}+447987654321`);
});
