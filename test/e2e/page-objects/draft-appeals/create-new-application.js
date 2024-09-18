const { expect } = require('@playwright/test');

async function createNewApplication(page, language) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 });
    await page.click('Create new application');
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 });
    await page.click('Creu cais newydd');
  }
}

module.exports = { createNewApplication };
