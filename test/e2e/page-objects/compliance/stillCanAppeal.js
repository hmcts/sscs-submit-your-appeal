const stillCanAppealContentEn = require('steps/compliance/still-can-appeal/content.en');
const stillCanAppealContentCy = require('steps/compliance/still-can-appeal/content.cy');
const { expect } = require('@playwright/test');

async function continueFromStillCanAppeal(page, language) {
  const stillCanAppealContent = language === 'en' ? stillCanAppealContentEn : stillCanAppealContentCy;

  await expect(page.getByText(stillCanAppealContent.title)).toBeVisible({ timeout: 45000 });
  await page.click(stillCanAppealContent.continueButton);
}

module.exports = { continueFromStillCanAppeal };
