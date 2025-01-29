const hearingSupportContentEn = require('steps/hearing/support/content.en');
const hearingSupportContentCy = require('steps/hearing/support/content.cy');
const { expect } = require('@playwright/test');

async function selectDoYouNeedSupportAndContinue(I, language, commonContent, option) {
  const hearingSupportContent = language === 'en' ? hearingSupportContentEn : hearingSupportContentCy;

  await expect(I.getByText(hearingSupportContent.title).first()).toBeVisible();
  if (option[0] === '#' || option[0] === '.') {
    await I.locator(option).first().check();
  } else {
    await I.getByText(option).first().check();
  }
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectDoYouNeedSupportAndContinue };
