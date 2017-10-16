'use strict';

const urls = require('urls');

Feature('Enter Mobile');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.smsNotify.enterMobile);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter a valid mobile number, I am taken to the sms-confirmation page', (I) => {

    I.fillField('#EnterMobile_mobileNumber', '07223344556');
    I.click('Continue');
    I.seeInCurrentUrl(urls.smsNotify.smsConfirmation);

});
