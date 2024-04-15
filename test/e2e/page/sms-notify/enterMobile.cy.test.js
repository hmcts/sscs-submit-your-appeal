const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Enter Mobile @batch-11`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.smsNotify.enterMobile);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I enter a valid mobile number, I am taken to the sms-confirmation page`, ({ I }) => {
  I.fillField('#enterMobile', '07223344556');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
});
