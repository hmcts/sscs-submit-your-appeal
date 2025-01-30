async function selectDoYouWantToReceiveTextMessageReminders(I, commonContent, option) {
  await I.locator(option).check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectDoYouWantToReceiveTextMessageReminders };
