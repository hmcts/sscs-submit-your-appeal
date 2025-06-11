const stillCanAppealContentEn = require('steps/compliance/still-can-appeal/content.en');
const stillCanAppealContentCy = require('steps/compliance/still-can-appeal/content.cy');
const { expect } = require('@playwright/test');

async function continueFromStillCanAppeal(I, language) {
  const stillCanAppealContent =
    language === 'en' ? stillCanAppealContentEn : stillCanAppealContentCy;

  await expect(I.getByText(stillCanAppealContent.title).first()).toBeVisible();
  await I.getByText(stillCanAppealContent.continueButton).first().click();
}

module.exports = { continueFromStillCanAppeal };
