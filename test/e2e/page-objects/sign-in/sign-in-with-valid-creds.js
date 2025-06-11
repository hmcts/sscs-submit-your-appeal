const paths = require('paths');
const { expect } = require('@playwright/test');

async function signIn(I, username, password, language) {
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
  if (language === 'en') {
    await expect(
      I.getByText('Your draft benefit appeals').first()
    ).toBeVisible();
  } else {
    await expect(
      I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()
    ).toBeVisible();
  }
}

async function signInVerifylanguage(I, username, password, language) {
  await I.locator('#username').first().fill(username);
  await I.locator('#password').first().fill(password);
  await I.locator("[name='save']").first().click();
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
  const altLang = await I.locator('.language').innerText();
  if (
    (altLang.trim() === 'English' && language === 'en') || (altLang.trim() === 'Cymraeg' && language === 'cy')
  ) {
    await I.goto(`${paths.drafts}?lng=${language}`);
  }

  if (language === 'en') {
    await expect(
      I.getByText('Your draft benefit appeals').first()
    ).toBeVisible();
  } else {
    await expect(
      I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()
    ).toBeVisible();
  }
}

async function navigateToSignInLink(I) {
  await I.getByText('Sign back into your appeal').first().click();
}

module.exports = { signIn, signInVerifylanguage, navigateToSignInLink };
