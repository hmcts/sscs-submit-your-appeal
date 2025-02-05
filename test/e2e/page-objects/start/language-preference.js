const lanugagePreferenceContentEn = require('steps/start/language-preference/content.en');
const lanugagePreferenceContentCy = require('steps/start/language-preference/content.cy');
const { expect } = require('@playwright/test');

async function chooseLanguagePreference(I, language, commonContent, answer) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(
    I.getByText(lanugagePreferenceContent.title).first()
  ).toBeVisible();
  await I.locator(`#languagePreferenceWelsh-${answer}`).first().click();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function chooseLanguagePreferenceAfterSignIn(
  I,
  language,
  commonContent,
  answer
) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(
    I.getByText(lanugagePreferenceContent.title).first()
  ).toBeVisible();
  await I.locator(`#languagePreferenceWelsh-${answer}`).first().click();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  chooseLanguagePreference,
  chooseLanguagePreferenceAfterSignIn
};
