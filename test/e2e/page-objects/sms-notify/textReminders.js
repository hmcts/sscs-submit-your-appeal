async function selectDoYouWantToReceiveTextMessageReminders(page, commonContent, option) {
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { selectDoYouWantToReceiveTextMessageReminders };
