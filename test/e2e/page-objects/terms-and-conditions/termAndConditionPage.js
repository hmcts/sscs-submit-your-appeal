const paths = require('paths');
const { expect } = require('@playwright/test');

async function seeAndGoToGivenLink(I, relatedLinkText, relatedLinkUrl) {
  await expect(I.getByText(relatedLinkText).first()).toBeVisible();
  await I.getByText(relatedLinkText).click();
  await I.waitForURL(`**/${relatedLinkUrl}`);
  await I.goto(paths.policy.termsAndConditions);
}

module.exports = { seeAndGoToGivenLink };
