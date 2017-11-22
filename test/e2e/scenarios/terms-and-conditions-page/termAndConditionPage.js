'use strict';

const paths = require('paths');
const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

Feature('Terms and Conditions Page');

Scenario('When I go to the Terms And Conditions page, I see the Term and Conditions section', (I) => {

    I.amOnPage(paths.termsAndConditions);
    I.seeElement('.link-back');
    I.see(termsAndConditionsContent.title);
    I.see(termsAndConditionsContent.termsAndConditions.termsOfuse);
    I.see('These include the GOV.UK privacy policy and terms and conditions.');
    I.click('privacy policy');
    I.seeInCurrentUrl('https://www.gov.uk/help/privacy-policy');
    I.amOnPage(paths.termsAndConditions);
    I.click('terms and conditions');
    I.seeInCurrentUrl('https://www.gov.uk/help/terms-conditions');

});

Scenario.only('When I go to the Terms And Conditions page, I see the Related links section', (I) => {

    I.amOnPage(paths.termsAndConditions);
    I.see(termsAndConditionsContent.relatedLinks.title);
    I.see(termsAndConditionsContent.relatedLinks.links.cookie.text);
    I.click(termsAndConditionsContent.relatedLinks.links.cookie.text);
    I.seeInCurrentUrl(termsAndConditionsContent.relatedLinks.links.cookie.url);
});
