const { expect } = require('@playwright/test');

async function createNewApplication(page, language) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible({ timeout: 45000 });
    await page.getByText('Create new application').first().click();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible({ timeout: 45000 });
    await page.getByText('Creu cais newydd').first().click();
  }
}

module.exports = { createNewApplication };
