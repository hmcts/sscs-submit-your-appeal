'use strict';

const urls = require('urls');

Feature('Check-your-appeal');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.checkYourAppeal);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I click submit your appeal, I am taken to the confirmation page', (I) => {

    I.goToConfirmationPage();

});
