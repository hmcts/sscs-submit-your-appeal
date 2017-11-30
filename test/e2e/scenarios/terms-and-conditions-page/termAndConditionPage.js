'use strict';

const paths = require('paths');
const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

Feature('Terms and Conditions Page');

Before((I) => {
    I.amOnPage(paths.termsAndConditions);
});

Scenario('When I go to the Terms And Conditions page, I see the page title text', (I) => {

    I.see(termsAndConditionsContent.title);

});

Scenario('When I go to the Terms And Conditions page, I see expected links and go to expected urls', (I) => {

    I.seeAndGoToGivenLink(termsAndConditionsContent.relatedLinks.cookie.text, termsAndConditionsContent.relatedLinks.cookie.url);
    I.seeAndGoToGivenLink(termsAndConditionsContent.relatedLinks.privacy.text, termsAndConditionsContent.relatedLinks.privacy.url);
    I.seeAndGoToGivenLink(termsAndConditionsContent.relatedLinks.conditions.text, termsAndConditionsContent.relatedLinks.conditions.url);
    I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.privacy.name, termsAndConditionsContent.relatedLinks.privacy.url);
    I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.terms.name, termsAndConditionsContent.relatedLinks.conditions.url);

});
