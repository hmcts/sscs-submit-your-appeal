const lanugagePreferenceContentEn = require('../../../../steps/start/language-preference/content.en');
const lanugagePreferenceContentCy = require('../../../../steps/start/language-preference/content.cy');
const { expect } = require('@playwright/test');

async function chooseLanguagePreference(page, language, commonContent, answer) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(page.getByText(lanugagePreferenceContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(`#languagePreferenceWelsh-${answer}`).first().click();
  await page.getByText(commonContent.continue).first().click();
}

async function chooseLanguagePreferenceAfterSignIn(page, language, commonContent, answer) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(page.getByText(lanugagePreferenceContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(`#languagePreferenceWelsh-${answer}`).first().click();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn };
