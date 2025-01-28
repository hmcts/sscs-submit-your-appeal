async function selectUseSameNumberAndContinue(I, commonContent, option) {
  await I.locator(option).check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectUseSameNumberAndContinue };
