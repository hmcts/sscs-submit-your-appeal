'use strict';

const paths = require('paths');
const termsAndConditionsContent = require('policy-pages/terms-and-conditions/content.en.json');

Feature('Terms and Conditions Page');

Before((I) => {
    I.amOnPage(paths.policy.termsAndConditions);
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

Scenario('When I go to the Terms And Conditions page, I see contact us section for customer communication', (I) => {
    I.see(termsAndConditionsContent.contactUs.title);
    I.see(termsAndConditionsContent.contactUs.EnglandAndWales.text);
    I.see(termsAndConditionsContent.contactUs.EnglandAndWales.phone);
    I.see(termsAndConditionsContent.contactUs.EnglandAndWales.open);
    I.see(termsAndConditionsContent.contactUs.Scotland.text);
    I.see(termsAndConditionsContent.contactUs.Scotland.phone);
    I.see(termsAndConditionsContent.contactUs.Scotland.open);
});

