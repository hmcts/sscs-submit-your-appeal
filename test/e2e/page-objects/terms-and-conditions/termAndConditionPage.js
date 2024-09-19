const paths = require('paths');
const { expect } = require('@playwright/test');

async function seeAndGoToGivenLink(page, relatedLinkText, relatedLinkUrl) {
  await expect(page.getByText(relatedLinkText).first()).toBeVisible();
  await page.getByText(relatedLinkText).first().click();
  await page.waitForURL(`**/${relatedLinkUrl}`);
  await page.goto(paths.policy.termsAndConditions);
}

module.exports = { seeAndGoToGivenLink };
