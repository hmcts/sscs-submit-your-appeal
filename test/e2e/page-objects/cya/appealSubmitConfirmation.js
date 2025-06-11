const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');
const { expect } = require('@playwright/test');

async function appealSubmitConfirmation(I, language) {
  const cyaContent =
    language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await I.waitForURL(paths.confirmation);
  await expect(I.getByText(cyaContent.confirmation)).toBeVisible();
}

module.exports = { appealSubmitConfirmation };
