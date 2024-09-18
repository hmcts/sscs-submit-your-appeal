function uploadAPieceOfEvidence(page) {
  
  await page.waitForTimeout(1);
  attachFile(page, '#uploadEv', 'evidence.txt');
  await page.waitForTimeout(2);
  await page.click('Continue');
  await page.waitForTimeout(2);
}

module.exports = {
  uploadAPieceOfEvidence,
};
