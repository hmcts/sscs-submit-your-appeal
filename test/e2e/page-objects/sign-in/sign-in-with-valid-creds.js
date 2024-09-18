const paths = require('paths');
const { expect } = require('@playwright/test');

async function signIn(page, username, password, language) {
  await page.waitForTimeout(5000);
  await page.fill({ id: 'username' }, username);
  await page.fill({ id: 'password' }, password);
  await page.click({ name: 'save' });
  // await page.waitForTimeout(5000);
  await page.locator(".form-buttons-group [href='/new-appeal']").first().waitFor({ timeout: 20000 });
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 });
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 });
  }
}

async function signInVerifylanguage(page, username, password, language) {
  await page.waitForTimeout(5000);
  await page.fill({ id: 'username' }, username);
  await page.fill({ id: 'password' }, password);
  await page.click({ name: 'save' });
  await page.locator(".form-buttons-group [href='/new-appeal']").first().waitFor({ timeout: 10000 });
  const altLang = await page.locator('.language').first().textContent().trim();
  if ((altLang === 'English' && language === 'en') || (altLang === 'Cymraeg' && language === 'cy')) {
    await page.goto(`${paths.drafts}?lng=${language}`);
    await page.waitForTimeout(2000);
  }

  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 });
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 });
  }
}

async function navigateToSignInLink(page) {
  await page.click('Sign back into your appeal');
  await page.waitForTimeout(2000);
}

module.exports = { signIn, signInVerifylanguage, navigateToSignInLink };
