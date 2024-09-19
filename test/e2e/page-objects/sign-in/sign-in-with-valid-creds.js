const paths = require('../../../../paths');
const { expect } = require('@playwright/test');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

async function signIn(page, username, password, language) {
  await page.waitForTimeout(5000);
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.getByText('Sign in').first().click();
  // await page.waitForTimeout(5000);
  await page.locator(".form-buttons-group [href='/new-appeal']").first().waitFor({ timeout: 20000 });
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible({ timeout: 45000 });
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible({ timeout: 45000 });
  }
}

async function signInVerifylanguage(page, username, password, language) {
  await page.waitForTimeout(5000);
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.getByText('Sign in').first().click();
  await page.locator(".form-buttons-group [href='/new-appeal']").first().waitFor({ timeout: 10000 });
  const altLang = await page.locator('.language').first().textContent().trim();
  if ((altLang === 'English' && language === 'en') || (altLang === 'Cymraeg' && language === 'cy')) {
    await page.goto(`${baseUrl}${paths.drafts}?lng=${language}`);
    await page.waitForTimeout(2000);
  }

  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible({ timeout: 45000 });
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible({ timeout: 45000 });
  }
}

async function navigateToSignInLink(page) {
  await page.getByText('Sign back into your appeal').first().click();
  await page.waitForTimeout(2000);
}

module.exports = { signIn, signInVerifylanguage, navigateToSignInLink };
