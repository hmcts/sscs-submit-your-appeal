'use strict';

const paths = require('paths');

Feature('Terms and Conditions Page');

Scenario.only('When I go to the Terms And Conditions page, I see the page information', (I) => {

    I.amOnPage(paths.termsAndConditions);
    I.see('Terms and conditions');
    I.seeElement('.link-back');

});
