async function continueFromIndependance(I, commonContent) {
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { continueFromIndependance };
