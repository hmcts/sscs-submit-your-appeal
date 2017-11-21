'use strict';

const paths = require('paths');
const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

Feature('Terms and Conditions Page');

Scenario.only('When I go to the Terms And Conditions page, I see the page information', (I) => {

    I.amOnPage(paths.termsAndConditions);
    I.see(termsAndConditionsContent.title);
    I.seeElement('.link-back');

});
