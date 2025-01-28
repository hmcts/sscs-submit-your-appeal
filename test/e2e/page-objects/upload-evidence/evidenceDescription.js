async function enterDescription(I, commonContent, description) {
  await I.waitForURL('**/evidence-description');
  await I.locator('textarea[name="describeTheEvidence"]').fill(description);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { enterDescription };
