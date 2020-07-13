const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Enter Mobile @batch-11');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.smsNotify.enterMobile);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];

  Scenario(`${language.toUpperCase()} - When I enter a valid mobile number, I am taken to the sms-confirmation page`, I => {
    I.fillField('#enterMobile', '07223344556');
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  });
});
