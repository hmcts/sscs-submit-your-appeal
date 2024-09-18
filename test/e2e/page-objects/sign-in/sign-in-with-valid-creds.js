const paths = require('paths');

function signIn(page, username, password, language) {
  
  await page.waitForTimeout(5);
  await page.fill({ id: 'username' }, username);
  await page.fill({ id: 'password' }, password);
  await page.click({ name: 'save' });
  // await page.waitForTimeout(5);
  page.waitForElement(".form-buttons-group [href='/new-appeal']", 20);
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 })
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 })
  }
}

async function signInVerifylanguage(page, username, password, language) {
  
  await page.waitForTimeout(5);
  await page.fill({ id: 'username' }, username);
  await page.fill({ id: 'password' }, password);
  await page.click({ name: 'save' });
  page.waitForElement(".form-buttons-group [href='/new-appeal']", 10);
  const altLang = await grabTextFrom(page, '.language');
  if ((altLang === 'English' && language === 'en') || (altLang === 'Cymraeg' && language === 'cy')) {
    page.goto(`${paths.drafts}?lng=${language}`);
    await page.waitForTimeout(2);
  }

  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 })
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 })
  }
}

function navigateToSignInLink(page) {
  
  await page.click('Sign back into your appeal');
  await page.waitForTimeout(2);
}

module.exports = { signIn, signInVerifylanguage, navigateToSignInLink };
