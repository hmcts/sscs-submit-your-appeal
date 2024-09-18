const language = 'en';
const termsAndConditionsContent = require(`steps/policy-pages/terms-and-conditions/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Terms and Conditions Page @batch-10`, () => {
  Before(async({ page }) => {
    page.goto(paths.policy.termsAndConditions);
  });

  test(`${language.toUpperCase()} - I see the page title text`, ({ page }) => {
    expect(page.getByText(termsAndConditionsContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see expected links and go to expected urls`, ({ page }) => {
    page.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.privacy.name, paths.policy.privacy);
    page.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.cookie.name, paths.policy.cookiePolicy);
    page.seeAndGoToGivenLink(termsAndConditionsContent.termsAndConditions.links.contact.name, paths.policy.contactUs);
  });
});
