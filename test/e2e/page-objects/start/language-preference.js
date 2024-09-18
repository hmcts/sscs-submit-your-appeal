const lanugagePreferenceContentEn = require('steps/start/language-preference/content.en');
const lanugagePreferenceContentCy = require('steps/start/language-preference/content.cy');

async function chooseLanguagePreference(page, language, commonContent, answer) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(page.getByText(lanugagePreferenceContent.title)).toBeVisible({ timeout: 45000 });
  await page.click({ id: `languagePreferenceWelsh-${answer}` });
  await page.click(commonContent.continue);
}

async function chooseLanguagePreferenceAfterSignIn(page, language, commonContent, answer) {
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  await expect(page.getByText(lanugagePreferenceContent.title)).toBeVisible({ timeout: 45000 });
  await page.click({ id: `languagePreferenceWelsh-${answer}` });
  await page.click(commonContent.saveAndContinue);
}

module.exports = { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn };
