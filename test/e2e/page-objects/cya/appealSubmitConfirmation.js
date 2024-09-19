const checkYourAppealContentEn = require('../../../../steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('../../../../steps/check-your-appeal/content.cy');
const paths = require('../../../../paths');
const { expect } = require('@playwright/test');

async function appealSubmitConfirmation(page, language) {
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await page.waitForTimeout(5000);
  await page.waitForURL(`**/${paths.confirmation}`);
  await expect(page.getByText(cyaContent.confirmation).first()).toBeVisible();
}

module.exports = { appealSubmitConfirmation };
