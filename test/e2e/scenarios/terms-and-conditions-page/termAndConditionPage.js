'use strict';

const paths = require('paths');
// const overviewContent = require('landing-pages/overview/content.en.json');

Feature('Terms and Conditions Page');

Scenario.only('When I go to the Terms And Conditions page, I see the page heading', (I) => {

    I.amOnPage(paths.termsAndConditions);
    I.see('Terms and conditions');

});
