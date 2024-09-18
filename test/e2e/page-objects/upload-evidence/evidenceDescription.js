function enterDescription(page, commonContent, description) {
  
  page.seeInCurrentUrl('evidence-description');
  await page.fill('textarea[name="describeTheEvidence"]', description);
  await page.click(commonContent.continue);
}

module.exports = { enterDescription };
