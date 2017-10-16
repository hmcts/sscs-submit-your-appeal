'use strict';

const urls = require('urls');
const content = require('steps/sms-notify/sms-confirmation/content.en.json');

Feature('SMS Confirmation');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.identity.enterAppellantDetails);
    I.enterAppellantDetailsWithMobileAndContinue();
    I.amOnPage(urls.smsNotify.smsConfirmation);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I click Continue, I am taken to the Representative page', (I) => {

    I.click(content.continue);
    I.seeInCurrentUrl(urls.representative.representative);

});

Scenario('When I click Change number, I am taken to the enter mobile page', (I) => {

    I.click(content.change);
    I.seeInCurrentUrl(urls.smsNotify.enterMobile);

});
