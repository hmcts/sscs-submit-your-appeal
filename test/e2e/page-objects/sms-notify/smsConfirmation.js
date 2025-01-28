async function readSMSConfirmationAndContinue(I, commonContent) {
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { readSMSConfirmationAndContinue };
