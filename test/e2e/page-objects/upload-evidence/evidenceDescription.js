async function enterDescription(page, commonContent, description) {
  await page.waitForURL(`**/${'evidence-description'}`);
  await page.fill('textarea[name="describeTheEvidence"]', description);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { enterDescription };
