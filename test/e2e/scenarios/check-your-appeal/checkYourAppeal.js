'use strict';

const paths = require('paths');
const content = require('steps/check-your-appeal/content.en.json');

Feature('Check-your-appeal');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.checkYourAppeal);
});

After((I) => {
    I.endTheSession();
});

Scenario('When I click submit your appeal, I am taken to the confirmation page', (I) => {

    I.see('Check your answers');
    I.see('Your application is incomplete');
    I.see('There are still some questions to answer');
    I.click('Continue your application');
    I.seeCurrentUrlEquals('/benefit-type');

});
