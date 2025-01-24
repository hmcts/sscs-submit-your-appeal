const { expect } = require('@playwright/test');

async function createNewApplication(I, language) {
  await expect(I.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  if (language === 'en') {
    await expect(I.getByText('Your draft benefit appeals').first()).toBeVisible();
    await I.locator('a.govuk-button:has-text("Create new application")').first().click();
  } else {
    await expect(I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible();
    await I.getByText('a.govuk-button:has-text("Creu cais newydd")').first().click();
  }
}

module.exports = { createNewApplication };