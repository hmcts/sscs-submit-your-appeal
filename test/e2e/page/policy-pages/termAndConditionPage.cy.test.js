const language = 'cy';
const termsAndConditionsContent = require(`steps/policy-pages/terms-and-conditions/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { seeAndGoToGivenLink } = require('../../page-objects/terms-and-conditions/termAndConditionPage');

test.describe(`${language.toUpperCase()} - Terms and Conditions Page @batch-10`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await page.goto(paths.policy.termsAndConditions);
  });

  test(`${language.toUpperCase()} - I see the page title text`, async({ page }) => {
    await expect(page.getByText(termsAndConditionsContent.title).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see expected links and go to expected urls`, async({ page }) => {
    await seeAndGoToGivenLink(page, termsAndConditionsContent.termsAndConditions.links.privacy.name, paths.policy.privacy);
    await seeAndGoToGivenLink(page, termsAndConditionsContent.termsAndConditions.links.cookie.name, paths.policy.cookiePolicy);
    await seeAndGoToGivenLink(page, termsAndConditionsContent.termsAndConditions.links.contact.name, paths.policy.contactUs);
  });
});
