async function uploadAPieceOfEvidence(page) {
  await page.waitForTimeout(1000);
  await page.locator('#uploadEv').setInputFiles('evidence.txt');
  await page.waitForTimeout(2000);
  await page.getByText('Continue').first().click();
  await page.waitForTimeout(2000);
}

module.exports = {
  uploadAPieceOfEvidence
};
