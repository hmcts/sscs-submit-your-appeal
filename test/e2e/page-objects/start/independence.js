const { expect } = require('@playwright/test');

async function continueFromIndependance(I, commonContent) {
  await expect(I.getByText('The tribunal is separate from DWP.').first()).toBeVisible();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { continueFromIndependance };
