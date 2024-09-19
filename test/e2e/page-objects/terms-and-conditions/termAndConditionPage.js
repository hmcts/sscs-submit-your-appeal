const paths = require('../../../../paths');
const { expect } = require('@playwright/test');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');
async function seeAndGoToGivenLink(page, relatedLinkText, relatedLinkUrl) {
  await expect(page.getByText(relatedLinkText).first()).toBeVisible();
  await page.getByText(relatedLinkText).first().click();
  await page.waitForURL(`**/${relatedLinkUrl}`);
  await page.goto(baseUrl + paths.policy.termsAndConditions);
}

module.exports = { seeAndGoToGivenLink };
