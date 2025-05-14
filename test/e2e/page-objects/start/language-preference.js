const lanugagePreferenceContentEn = require('steps/start/language-preference/content.en');
const lanugagePreferenceContentCy = require('steps/start/language-preference/content.cy');
const { expect } = require('@playwright/test');

async function chooseLanguagePreference(I, language, commonContent, option) {
  const currentLanguage = await I.evaluate(() => document.documentElement.lang);
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  if (currentLanguage === language) {
    return;
  }

  await expect(
    I.getByText(lanugagePreferenceContent.title).first()
  ).toBeVisible();
  await I.locator(option).first().click();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function chooseLanguagePreferenceAfterSignIn(
  I,
  language,
  commonContent,
  option
) {
  const currentLanguage = await I.evaluate(() => document.documentElement.lang);
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  if (currentLanguage === language) {
    return;
  }

  await expect(
    I.getByText(lanugagePreferenceContent.title).first()
  ).toBeVisible();
  await I.locator(option).first().click();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  chooseLanguagePreference,
  chooseLanguagePreferenceAfterSignIn
};
