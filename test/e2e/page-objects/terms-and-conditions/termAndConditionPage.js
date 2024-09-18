const paths = require('paths');
const { expect } = require('@playwright/test');

async function seeAndGoToGivenLink(page, relatedLinkText, relatedLinkUrl) {
  await expect(page.getByText(relatedLinkText)).toBeVisible();
  await page.click(relatedLinkText);
  await page.waitForURL(`**/${relatedLinkUrl}`);
  await page.goto(paths.policy.termsAndConditions);
}

module.exports = { seeAndGoToGivenLink };
