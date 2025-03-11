const postCodeContentEn = require('steps/start/postcode-checker/content.en');
const postCodeContentCy = require('steps/start/postcode-checker/content.cy');
const { expect } = require('@playwright/test');

async function enterPostcodeAndContinue(I, language, commonContent, postcode) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(I.getByText(postCodeContent.title).first()).toBeVisible();
  await I.locator('#postcode').first().fill(postcode);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterPostcodeAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  postcode
) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(I.getByText(postCodeContent.title).first()).toBeVisible();
  await I.locator('#postcode').first().fill(postcode);
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  enterPostcodeAndContinue,
  enterPostcodeAndContinueAfterSignIn
};
