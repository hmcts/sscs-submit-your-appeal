const paths = require('paths');
const { expect } = require('@playwright/test');

async function signIn(I, username, password, language) {
  await I.locator('#username').first().fill(username);
  await I.locator('#password').first().fill(password);
  await I.locator("[name='save']").first().click();
  // await I.waitForTimeout(5000);
  try {
    const buttonText =
      language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(
      I.locator(`.govuk-button:has-text('${buttonText}')`).first()
    ).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    const buttonText =
      language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(
      I.locator(`.govuk-button:has-text('${buttonText}')`).first()
    ).toBeVisible();
  }
  const titleText =
    language === 'en' ? 'Check your answers' : 'Gwiriwch eich atebion';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function signBackIn(I, username, password, language) {
  await I.locator('#username').first().fill(username);
  await I.locator('#password').first().fill(password);
  await I.locator("[name='save']").first().click();
  // await I.waitForTimeout(5000);
  try {
    await expect(
      I.locator(".form-buttons-group [href='/new-appeal']").first()
    ).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    await expect(
      I.locator(".form-buttons-group [href='/new-appeal']").first()
    ).toBeVisible();
  }
  const titleText =
    language === 'en'
      ? 'Your draft benefit appeals'
      : 'Drafft o’ch apeliadau ynghylch budd-daliadau';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function signInVerifylanguage(I, username, password, language) {
  await I.locator('#username').first().fill(username);
  await I.locator('#password').first().fill(password);
  await I.locator("[name='save']").first().click();
  try {
    const buttonText =
      language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(
      I.locator(`.govuk-button:has-text('${buttonText}')`).first()
    ).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    const buttonText =
      language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(
      I.locator(`.govuk-button:has-text('${buttonText}')`).first()
    ).toBeVisible();
  }
  const altLang = await I.locator('.language').innerText();
  if (
    (altLang.trim() === 'English' && language === 'en') ||
    (altLang.trim() === 'Cymraeg' && language === 'cy')
  ) {
    await I.goto(`${paths.drafts}?lng=${language}`);
  }

  const titleText =
    language === 'en' ? 'Check your answers' : 'Gwiriwch eich atebion';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function navigateToSignInLink(I) {
  await I.getByText('Sign back into your appeal').first().click();
}

module.exports = {
  signIn,
  signBackIn,
  signInVerifylanguage,
  navigateToSignInLink
};
