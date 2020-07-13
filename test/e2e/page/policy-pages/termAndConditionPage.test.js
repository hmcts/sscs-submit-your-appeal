const termsAndConditionsContentEn = require('steps/policy-pages/terms-and-conditions/content.en');
const termsAndConditionsContentCy = require('steps/policy-pages/terms-and-conditions/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Terms and Conditions Page @batch-10');

languages.forEach(language => {
  Before(I => {
    I.amOnPage(paths.policy.termsAndConditions);
  });

  const termsAndConditionsContent = language === 'en' ? termsAndConditionsContentEn : termsAndConditionsContentCy;

  Scenario(`${language.toUpperCase()} - I see the page title text`, I => {
    I.see(termsAndConditionsContent.title);
  });

  Scenario(`${language.toUpperCase()} - I see expected links and go to expected urls`, I => {
    I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.privacy.name, paths.policy.privacy);
    I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.cookie.name, paths.policy.cookiePolicy);
    I.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.contact.name, paths.policy.contactUs);
  });
});
