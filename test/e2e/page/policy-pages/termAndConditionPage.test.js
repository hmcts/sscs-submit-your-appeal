const paths = require('paths');
const termsAndConditionsContent = require('policy-pages/terms-and-conditions/content.en.json');

Feature('Terms and Conditions Page @batch-10');

Before(I => {
  I.amOnPage(paths.policy.termsAndConditions);
});

Scenario('I see the page title text', I => {
  I.see(termsAndConditionsContent.title);
});

Scenario('I see expected links and go to expected urls', I => {
  I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.privacy.name,
    paths.policy.privacy);
  I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.cookie.name,
    paths.policy.cookiePolicy);
  I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.contact.name,
    paths.policy.contactUs);
});
