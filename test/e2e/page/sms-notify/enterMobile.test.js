const paths = require('paths');

Feature('Enter Mobile');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.smsNotify.enterMobile);
});

After(I => {
  I.endTheSession();
});

Scenario('When I enter a valid mobile number, I am taken to the sms-confirmation page', I => {
  I.fillField('#enterMobile', '07223344556');
  I.click('Continue');
  I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
});
