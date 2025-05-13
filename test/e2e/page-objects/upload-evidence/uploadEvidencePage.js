const { expect } = require('@playwright/test');

async function uploadAPieceOfEvidence(I) {
  await I.locator('#uploadEv').setInputFiles('evidence.txt');
  await expect(
    I.locator('a[href="/evidence-upload/item-0/delete"]').first()
  ).toBeVisible();
  await I.getByRole('button', { name: 'Continue' }).first().click();
  try {
    await I.waitForURL('**/evidence-description');
  } catch {
    await I.getByRole('button', { name: 'Continue' }).first().click();
  }
}

module.exports = {
  uploadAPieceOfEvidence
};
